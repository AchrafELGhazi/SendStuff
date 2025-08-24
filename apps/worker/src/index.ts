
import dotenv from 'dotenv';

// Load environment variables first
dotenv.config();

import Bull from 'bull';

import { env } from '@sendstuff/config';
import { logger } from './utils/logger';
import { processCampaign } from './processors/campaign-processor';

// Initialize Redis connection for Bull
const redis = {
  host: env.REDIS_URL ? new URL(env.REDIS_URL).hostname : 'localhost',
  port: env.REDIS_URL ? parseInt(new URL(env.REDIS_URL).port) : 6379,
  password: env.REDIS_URL ? new URL(env.REDIS_URL).password : undefined,
};

// Create job queues
export const campaignQueue = new Bull('campaign processing', { redis });
export const emailQueue = new Bull('email sending', { redis });

// Process campaign jobs
campaignQueue.process('send-campaign', 5, processCampaign);

// Queue event handlers
campaignQueue.on('completed', (job) => {
  logger.info(`Campaign job completed: ${job.id}`);
});

campaignQueue.on('failed', (job, err) => {
  logger.error(`Campaign job failed: ${job.id}`, err);
});

campaignQueue.on('stalled', (job) => {
  logger.warn(`Campaign job stalled: ${job.id}`);
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  logger.info('SIGTERM received, closing queues...');
  await campaignQueue.close();
  await emailQueue.close();
  process.exit(0);
});

logger.info('🔄 SendStuff Worker started');
logger.info(`📊 Environment: ${env.NODE_ENV}`);