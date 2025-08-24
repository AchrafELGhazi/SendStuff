
import type { Job } from 'bull';
import { render } from '@react-email/render';

import { prisma } from '@sendstuff/database';
import { createEmailService } from '@sendstuff/email';
import { CampaignEmail } from '@sendstuff/email';

import { logger } from '../utils/logger';

interface CampaignJobData {
  campaignId: string;
}

export async function processCampaign(job: Job<CampaignJobData>) {
  const { campaignId } = job.data;
  
  logger.info(`Processing campaign: ${campaignId}`);

  try {
    // Get campaign with subscribers
    const campaign = await prisma.campaign.findUnique({
      where: { id: campaignId },
      include: {
        user: {
          include: {
            subscribers: {
              where: { status: 'ACTIVE' },
            },
          },
        },
      },
    });

    if (!campaign) {
      throw new Error(`Campaign not found: ${campaignId}`);
    }

    if (campaign.status !== 'SENDING') {
      throw new Error(`Campaign is not in SENDING status: ${campaign.status}`);
    }

    const subscribers = campaign.user.subscribers;
    
    if (subscribers.length === 0) {
      logger.warn(`No active subscribers for campaign: ${campaignId}`);
      
      await prisma.campaign.update({
        where: { id: campaignId },
        data: { 
          status: 'SENT',
          sentAt: new Date(),
        },
      });
      
      return;
    }

    // Initialize email service
    const emailService = createEmailService();

    // Send emails in batches
    const batchSize = 100;
    const batches = [];
    
    for (let i = 0; i < subscribers.length; i += batchSize) {
      batches.push(subscribers.slice(i, i + batchSize));
    }

    let totalSent = 0;
    let totalErrors = 0;

    for (const [batchIndex, batch] of batches.entries()) {
      logger.info(`Processing batch ${batchIndex + 1}/${batches.length} for campaign ${campaignId}`);
      
      // Update job progress
      const progress = Math.round(((batchIndex + 1) / batches.length) * 100);
      await job.progress(progress);

      const emailPromises = batch.map(async (subscriber) => {
        try {
          // Render email content
          const emailHtml = campaign.htmlContent || 
            render(CampaignEmail({ 
              subject: campaign.subject,
              content: campaign.content,
            }));

          // Send email
          const result = await emailService.send({
            to: subscriber.email,
            subject: campaign.subject,
            html: emailHtml,
          });

          // Log the result
          await prisma.campaignLog.create({
            data: {
              campaignId: campaign.id,
              subscriberId: subscriber.id,
              event: result.success ? 'SENT' : 'BOUNCED',
              metadata: {
                messageId: result.messageId,
                error: result.error,
              },
            },
          });

          if (result.success) {
            totalSent++;
          } else {
            totalErrors++;
            logger.error(`Failed to send email to ${subscriber.email}: ${result.error}`);
          }

          return result;
        } catch (error) {
          totalErrors++;
          logger.error(`Error sending email to ${subscriber.email}:`, error);
          
          // Log the error
          await prisma.campaignLog.create({
            data: {
              campaignId: campaign.id,
              subscriberId: subscriber.id,
              event: 'BOUNCED',
              metadata: {
                error: error instanceof Error ? error.message : 'Unknown error',
              },
            },
          });

          return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
        }
      });

      // Wait for batch to complete
      await Promise.allSettled(emailPromises);
      
      // Add delay between batches to respect rate limits
      if (batchIndex < batches.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    // Update campaign status
    await prisma.campaign.update({
      where: { id: campaignId },
      data: { 
        status: 'SENT',
        sentAt: new Date(),
      },
    });

    logger.info(`Campaign ${campaignId} completed. Sent: ${totalSent}, Errors: ${totalErrors}`);

    return {
      campaignId,
      totalSubscribers: subscribers.length,
      totalSent,
      totalErrors,
    };

  } catch (error) {
    logger.error(`Error processing campaign ${campaignId}:`, error);
    
    // Update campaign status to failed
    await prisma.campaign.update({
      where: { id: campaignId },
      data: { status: 'DRAFT' }, // Reset to draft so it can be retried
    });

    throw error;
  }
}