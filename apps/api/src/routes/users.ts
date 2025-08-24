
import { Router } from 'express';

import { prisma } from '@sendstuff/database';

import { authenticate, authorize } from '../middleware/auth';

export const usersRouter = Router();

// Apply authentication to all user routes
usersRouter.use(authenticate);

// Get current user profile
usersRouter.get('/me', async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.id },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
        _count: {
          select: {
            campaigns: true,
            subscribers: true,
          },
        },
      },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found',
      });
    }

    res.json({
      success: true,
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch user profile',
    });
  }
});

// Get dashboard stats
usersRouter.get('/stats', async (req, res) => {
  try {
    const userId = req.user!.id;

    const [
      totalSubscribers,
      totalCampaigns,
      sentCampaigns,
      deliveredLogs,
      openedLogs,
      clickedLogs,
      bouncedLogs,
    ] = await Promise.all([
      prisma.subscriber.count({
        where: { userId, status: 'ACTIVE' },
      }),
      prisma.campaign.count({
        where: { userId },
      }),
      prisma.campaign.count({
        where: { userId, status: 'SENT' },
      }),
      prisma.campaignLog.count({
        where: { 
          campaign: { userId },
          event: 'DELIVERED',
        },
      }),
      prisma.campaignLog.count({
        where: { 
          campaign: { userId },
          event: 'OPENED',
        },
      }),
      prisma.campaignLog.count({
        where: { 
          campaign: { userId },
          event: 'CLICKED',
        },
      }),
      prisma.campaignLog.count({
        where: { 
          campaign: { userId },
          event: 'BOUNCED',
        },
      }),
    ]);

    // Calculate rates
    const totalSent = deliveredLogs + bouncedLogs;
    const deliveryRate = totalSent > 0 ? ((deliveredLogs / totalSent) * 100) : 0;
    const openRate = deliveredLogs > 0 ? ((openedLogs / deliveredLogs) * 100) : 0;
    const clickRate = deliveredLogs > 0 ? ((clickedLogs / deliveredLogs) * 100) : 0;

    // Get recent activity
    const recentCampaigns = await prisma.campaign.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 5,
      select: {
        id: true,
        title: true,
        status: true,
        createdAt: true,
        sentAt: true,
      },
    });

    const recentActivity = recentCampaigns.map(campaign => ({
      id: campaign.id,
      type: campaign.status === 'SENT' ? 'campaign_sent' : 'campaign_created',
      message: campaign.status === 'SENT' 
        ? `Campaign "${campaign.title}" was sent`
        : `Campaign "${campaign.title}" was created`,
      timestamp: campaign.sentAt || campaign.createdAt,
    }));

    res.json({
      success: true,
      data: {
        totalSubscribers,
        totalCampaigns,
        deliveryRate: Math.round(deliveryRate * 100) / 100,
        openRate: Math.round(openRate * 100) / 100,
        clickRate: Math.round(clickRate * 100) / 100,
        recentActivity,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch dashboard stats',
    });
  }
});

// Admin-only: Get all users
usersRouter.get('/', authorize(['ADMIN']), async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
        _count: {
          select: {
            campaigns: true,
            subscribers: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json({
      success: true,
      data: users,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch users',
    });
  }
});