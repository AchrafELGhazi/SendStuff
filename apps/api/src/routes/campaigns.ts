
import { Router } from 'express';
import { body, query, validationResult } from 'express-validator';

import { prisma } from '@sendstuff/database';
import { createCampaignSchema, paginationSchema } from '@sendstuff/shared';

import { authenticate } from '../middleware/auth';

export const campaignsRouter = Router();

// Apply authentication to all campaign routes
campaignsRouter.use(authenticate);

// Get all campaigns with pagination
campaignsRouter.get('/', [
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
  query('status').optional().isIn(['DRAFT', 'SCHEDULED', 'SENDING', 'SENT', 'CANCELLED']),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: errors.array(),
      });
    }

    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const status = req.query.status as string;
    const skip = (page - 1) * limit;

    const where = {
      userId: req.user!.id,
      ...(status && { status }),
    };

    const [campaigns, total] = await Promise.all([
      prisma.campaign.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          _count: {
            select: { campaignLogs: true },
          },
        },
      }),
      prisma.campaign.count({ where }),
    ]);

    const pages = Math.ceil(total / limit);

    res.json({
      success: true,
      data: campaigns,
      pagination: {
        page,
        limit,
        total,
        pages,
        hasNext: page < pages,
        hasPrev: page > 1,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch campaigns',
    });
  }
});

// Create campaign
campaignsRouter.post('/', [
  body('title').notEmpty().trim(),
  body('subject').notEmpty().trim(),
  body('content').notEmpty(),
  body('htmlContent').optional(),
  body('scheduledAt').optional().isISO8601(),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: errors.array(),
      });
    }

    const { title, subject, content, htmlContent, scheduledAt } = req.body;

    const campaign = await prisma.campaign.create({
      data: {
        title,
        subject,
        content,
        htmlContent,
        scheduledAt: scheduledAt ? new Date(scheduledAt) : null,
        userId: req.user!.id,
      },
    });

    res.status(201).json({
      success: true,
      data: campaign,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to create campaign',
    });
  }
});

// Get campaign by ID
campaignsRouter.get('/:id', async (req, res) => {
  try {
    const campaign = await prisma.campaign.findFirst({
      where: {
        id: req.params.id,
        userId: req.user!.id,
      },
      include: {
        _count: {
          select: { campaignLogs: true },
        },
        campaignLogs: {
          include: {
            subscriber: {
              select: {
                id: true,
                email: true,
                name: true,
              },
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
          take: 10, // Latest 10 logs
        },
      },
    });

    if (!campaign) {
      return res.status(404).json({
        success: false,
        error: 'Campaign not found',
      });
    }

    res.json({
      success: true,
      data: campaign,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch campaign',
    });
  }
});

// Update campaign
campaignsRouter.put('/:id', [
  body('title').optional().notEmpty().trim(),
  body('subject').optional().notEmpty().trim(),
  body('content').optional().notEmpty(),
  body('htmlContent').optional(),
  body('scheduledAt').optional().isISO8601(),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: errors.array(),
      });
    }

    const { title, subject, content, htmlContent, scheduledAt } = req.body;

    const campaign = await prisma.campaign.updateMany({
      where: {
        id: req.params.id,
        userId: req.user!.id,
        status: 'DRAFT', // Only allow editing draft campaigns
      },
      data: {
        ...(title && { title }),
        ...(subject && { subject }),
        ...(content && { content }),
        ...(htmlContent !== undefined && { htmlContent }),
        ...(scheduledAt && { scheduledAt: new Date(scheduledAt) }),
      },
    });

    if (campaign.count === 0) {
      return res.status(404).json({
        success: false,
        error: 'Campaign not found or cannot be edited',
      });
    }

    const updatedCampaign = await prisma.campaign.findUnique({
      where: { id: req.params.id },
    });

    res.json({
      success: true,
      data: updatedCampaign,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to update campaign',
    });
  }
});

// Delete campaign
campaignsRouter.delete('/:id', async (req, res) => {
  try {
    const campaign = await prisma.campaign.deleteMany({
      where: {
        id: req.params.id,
        userId: req.user!.id,
        status: 'DRAFT', // Only allow deleting draft campaigns
      },
    });

    if (campaign.count === 0) {
      return res.status(404).json({
        success: false,
        error: 'Campaign not found or cannot be deleted',
      });
    }

    res.json({
      success: true,
      message: 'Campaign deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to delete campaign',
    });
  }
});

// Send campaign
campaignsRouter.post('/:id/send', async (req, res) => {
  try {
    const campaign = await prisma.campaign.findFirst({
      where: {
        id: req.params.id,
        userId: req.user!.id,
        status: 'DRAFT',
      },
    });

    if (!campaign) {
      return res.status(404).json({
        success: false,
        error: 'Campaign not found or cannot be sent',
      });
    }

    // Update campaign status to SENDING
    await prisma.campaign.update({
      where: { id: campaign.id },
      data: { status: 'SENDING' },
    });

    // TODO: Queue campaign for sending (implement with Bull queue)
    // await campaignQueue.add('send-campaign', { campaignId: campaign.id });

    res.json({
      success: true,
      message: 'Campaign queued for sending',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to send campaign',
    });
  }
});