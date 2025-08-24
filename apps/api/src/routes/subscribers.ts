
import { Router } from 'express';
import { body, query, validationResult } from 'express-validator';

import { prisma } from '@sendstuff/database';

import { authenticate } from '../middleware/auth';

export const subscribersRouter = Router();

// Apply authentication to all subscriber routes
subscribersRouter.use(authenticate);

// Get all subscribers with pagination and filtering
subscribersRouter.get('/', [
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
  query('status').optional().isIn(['ACTIVE', 'UNSUBSCRIBED', 'BOUNCED']),
  query('search').optional().trim(),
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
    const search = req.query.search as string;
    const skip = (page - 1) * limit;

    const where = {
      userId: req.user!.id,
      ...(status && { status }),
      ...(search && {
        OR: [
          { email: { contains: search, mode: 'insensitive' as const } },
          { name: { contains: search, mode: 'insensitive' as const } },
        ],
      }),
    };

    const [subscribers, total] = await Promise.all([
      prisma.subscriber.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.subscriber.count({ where }),
    ]);

    const pages = Math.ceil(total / limit);

    res.json({
      success: true,
      data: subscribers,
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
      error: 'Failed to fetch subscribers',
    });
  }
});

// Create subscriber
subscribersRouter.post('/', [
  body('email').isEmail().normalizeEmail(),
  body('name').optional().trim().escape(),
  body('tags').optional().isArray(),
  body('metadata').optional().isObject(),
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

    const { email, name, tags, metadata } = req.body;

    // Check if subscriber already exists
    const existing = await prisma.subscriber.findUnique({
      where: {
        email_userId: {
          email,
          userId: req.user!.id,
        },
      },
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        error: 'Subscriber already exists',
      });
    }

    const subscriber = await prisma.subscriber.create({
      data: {
        email,
        name,
        tags: tags || [],
        metadata: metadata || {},
        userId: req.user!.id,
      },
    });

    res.status(201).json({
      success: true,
      data: subscriber,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to create subscriber',
    });
  }
});

// Bulk import subscribers
subscribersRouter.post('/import', [
  body('subscribers').isArray({ min: 1 }),
  body('subscribers.*.email').isEmail(),
  body('subscribers.*.name').optional().trim(),
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

    const { subscribers: importData } = req.body;
    const userId = req.user!.id;

    // Get existing emails to avoid duplicates
    const existingEmails = await prisma.subscriber.findMany({
      where: {
        userId,
        email: { in: importData.map((s: any) => s.email) },
      },
      select: { email: true },
    });

    const existingEmailSet = new Set(existingEmails.map(s => s.email));

    // Filter out duplicates
    const newSubscribers = importData.filter((s: any) => 
      !existingEmailSet.has(s.email)
    );

    if (newSubscribers.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'All subscribers already exist',
      });
    }

    // Bulk create
    const created = await prisma.subscriber.createMany({
      data: newSubscribers.map((s: any) => ({
        ...s,
        userId,
        tags: s.tags || [],
        metadata: s.metadata || {},
      })),
    });

    res.status(201).json({
      success: true,
      data: {
        created: created.count,
        skipped: importData.length - created.count,
        total: importData.length,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to import subscribers',
    });
  }
});

// Get subscriber by ID
subscribersRouter.get('/:id', async (req, res) => {
  try {
    const subscriber = await prisma.subscriber.findFirst({
      where: {
        id: req.params.id,
        userId: req.user!.id,
      },
      include: {
        campaignLogs: {
          include: {
            campaign: {
              select: {
                id: true,
                title: true,
                subject: true,
              },
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
    });

    if (!subscriber) {
      return res.status(404).json({
        success: false,
        error: 'Subscriber not found',
      });
    }

    res.json({
      success: true,
      data: subscriber,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch subscriber',
    });
  }
});

// Update subscriber
subscribersRouter.put('/:id', [
  body('name').optional().trim().escape(),
  body('status').optional().isIn(['ACTIVE', 'UNSUBSCRIBED', 'BOUNCED']),
  body('tags').optional().isArray(),
  body('metadata').optional().isObject(),
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

    const { name, status, tags, metadata } = req.body;

    const subscriber = await prisma.subscriber.updateMany({
      where: {
        id: req.params.id,
        userId: req.user!.id,
      },
      data: {
        ...(name !== undefined && { name }),
        ...(status && { status }),
        ...(tags && { tags }),
        ...(metadata && { metadata }),
      },
    });

    if (subscriber.count === 0) {
      return res.status(404).json({
        success: false,
        error: 'Subscriber not found',
      });
    }

    const updatedSubscriber = await prisma.subscriber.findUnique({
      where: { id: req.params.id },
    });

    res.json({
      success: true,
      data: updatedSubscriber,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to update subscriber',
    });
  }
});

// Delete subscriber
subscribersRouter.delete('/:id', async (req, res) => {
  try {
    const subscriber = await prisma.subscriber.deleteMany({
      where: {
        id: req.params.id,
        userId: req.user!.id,
      },
    });

    if (subscriber.count === 0) {
      return res.status(404).json({
        success: false,
        error: 'Subscriber not found',
      });
    }

    res.json({
      success: true,
      message: 'Subscriber deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to delete subscriber',
    });
  }
});