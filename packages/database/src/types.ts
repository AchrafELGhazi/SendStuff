import type { Prisma } from '@prisma/client'

// ================================
// USER & ORGANIZATION TYPES
// ================================

export type UserWithProfile = Prisma.UserGetPayload<{
    include: {
        organizationMembers: {
            include: {
                organization: true
            }
        }
    }
}>

export type OrganizationWithMembers = Prisma.OrganizationGetPayload<{
    include: {
        members: {
            include: {
                user: {
                    select: {
                        id: true
                        email: true
                        firstName: true
                        lastName: true
                        avatar: true
                    }
                }
            }
        }
        createdBy: {
            select: {
                id: true
                email: true
                firstName: true
                lastName: true
            }
        }
    }
}>

// ================================
// NEWSLETTER & SUBSCRIBER TYPES
// ================================

export type NewsletterWithStats = Prisma.NewsletterGetPayload<{
    include: {
        _count: {
            select: {
                subscribers: true
                campaigns: true
                segments: true
            }
        }
        organization: {
            select: {
                id: true
                name: true
                slug: true
            }
        }
        user: {
            select: {
                id: true
                firstName: true
                lastName: true
                email: true
            }
        }
    }
}>

export type SubscriberWithNewsletters = Prisma.SubscriberGetPayload<{
    include: {
        newsletters: {
            include: {
                newsletter: {
                    select: {
                        id: true
                        name: true
                        slug: true
                    }
                }
            }
        }
        segmentMembers: {
            include: {
                segment: {
                    select: {
                        id: true
                        name: true
                        color: true
                    }
                }
            }
        }
    }
}>

export type NewsletterSubscriberWithDetails = Prisma.NewsletterSubscriberGetPayload<{
    include: {
        newsletter: {
            select: {
                id: true
                name: true
                slug: true
            }
        }
        subscriber: {
            select: {
                id: true
                email: true
                firstName: true
                lastName: true
                customFields: true
                createdAt: true
            }
        }
    }
}>

// ================================
// CAMPAIGN TYPES
// ================================

export type CampaignWithDetails = Prisma.CampaignGetPayload<{
    include: {
        newsletter: {
            select: {
                id: true
                name: true
                slug: true
            }
        }
        segment: {
            select: {
                id: true
                name: true
                color: true
            }
        }
        template: {
            select: {
                id: true
                name: true
                thumbnail: true
            }
        }
        user: {
            select: {
                id: true
                firstName: true
                lastName: true
                email: true
            }
        }
        analytics: true
        _count: {
            select: {
                recipients: true
                abTests: true
            }
        }
    }
}>

export type CampaignWithAnalytics = Prisma.CampaignGetPayload<{
    include: {
        analytics: true
        newsletter: {
            select: {
                id: true
                name: true
                slug: true
            }
        }
        _count: {
            select: {
                recipients: true
            }
        }
    }
}>

export type CampaignRecipientWithDetails = Prisma.CampaignRecipientGetPayload<{
    include: {
        subscriber: {
            select: {
                id: true
                email: true
                firstName: true
                lastName: true
            }
        }
        campaign: {
            select: {
                id: true
                name: true
                subject: true
            }
        }
        activities: {
            orderBy: {
                timestamp: 'desc'
            }
        }
    }
}>

// ================================
// SEGMENT TYPES
// ================================

export type SegmentWithMembers = Prisma.SegmentGetPayload<{
    include: {
        _count: {
            select: {
                members: true
                campaigns: true
            }
        }
        newsletter: {
            select: {
                id: true
                name: true
                slug: true
            }
        }
    }
}>

export type SegmentMemberWithDetails = Prisma.SegmentMemberGetPayload<{
    include: {
        subscriber: {
            select: {
                id: true
                email: true
                firstName: true
                lastName: true
                customFields: true
                createdAt: true
            }
        }
        segment: {
            select: {
                id: true
                name: true
                color: true
            }
        }
    }
}>

// ================================
// AUTOMATION TYPES
// ================================

export type AutomationWithSteps = Prisma.AutomationGetPayload<{
    include: {
        steps: {
            orderBy: {
                order: 'asc'
            }
        }
        newsletter: {
            select: {
                id: true
                name: true
                slug: true
            }
        }
        _count: {
            select: {
                executions: true
            }
        }
    }
}>

export type AutomationExecutionWithDetails = Prisma.AutomationExecutionGetPayload<{
    include: {
        automation: {
            select: {
                id: true
                name: true
                type: true
            }
        }
    }
}>

// ================================
// TEMPLATE TYPES
// ================================

export type TemplateWithDetails = Prisma.TemplateGetPayload<{
    include: {
        user: {
            select: {
                id: true
                firstName: true
                lastName: true
                email: true
            }
        }
        newsletter: {
            select: {
                id: true
                name: true
                slug: true
            }
        }
        _count: {
            select: {
                campaigns: true
            }
        }
    }
}>

// ================================
// ANALYTICS TYPES
// ================================

export type SubscriberActivityWithDetails = Prisma.SubscriberActivityGetPayload<{
    include: {
        subscriber: {
            select: {
                id: true
                email: true
                firstName: true
                lastName: true
            }
        }
        campaignRecipient: {
            include: {
                campaign: {
                    select: {
                        id: true
                        name: true
                        subject: true
                    }
                }
            }
        }
    }
}>

// ================================
// INTEGRATION TYPES
// ================================

export type IntegrationWithWebhooks = Prisma.IntegrationGetPayload<{
    include: {
        webhooks: {
            include: {
                _count: {
                    select: {
                        deliveries: true
                    }
                }
            }
        }
        organization: {
            select: {
                id: true
                name: true
                slug: true
            }
        }
    }
}>

export type WebhookWithDeliveries = Prisma.WebhookGetPayload<{
    include: {
        integration: {
            select: {
                id: true
                name: true
                type: true
            }
        }
        deliveries: {
            orderBy: {
                deliveredAt: 'desc'
            }
            take: 10
        }
    }
}>

// ================================
// BILLING TYPES
// ================================

export type BillingPlanWithInvoices = Prisma.BillingPlanGetPayload<{
    include: {
        organization: {
            select: {
                id: true
                name: true
                slug: true
            }
        }
        invoices: {
            orderBy: {
                createdAt: 'desc'
            }
            take: 10
        }
    }
}>

// ================================
// API RESPONSE TYPES
// ================================

export interface PaginationMeta {
    page: number
    limit: number
    total: number
    totalPages: number
    hasNext: boolean
    hasPrev: boolean
}

export interface PaginatedResponse<T> {
    data: T[]
    meta: PaginationMeta
}

export interface ApiResponse<T = any> {
    success: boolean
    data?: T
    message?: string
    errors?: Record<string, string[]>
}

// ================================
// SEARCH & FILTER TYPES
// ================================

export interface SubscriberFilters {
    status?: string[]
    newsletterId?: string
    segmentId?: string
    country?: string[]
    source?: string[]
    dateRange?: {
        from: Date
        to: Date
    }
    search?: string
}

export interface CampaignFilters {
    status?: string[]
    type?: string[]
    newsletterId?: string
    userId?: string
    dateRange?: {
        from: Date
        to: Date
    }
    search?: string
}

export interface AnalyticsDateRange {
    from: Date
    to: Date
    period: 'day' | 'week' | 'month' | 'quarter' | 'year'
}

// ================================
// DASHBOARD STATS TYPES
// ================================

export interface DashboardStats {
    subscribers: {
        total: number
        active: number
        growth: number
        growthPercent: number
    }
    campaigns: {
        total: number
        sent: number
        scheduled: number
        draft: number
    }
    performance: {
        avgOpenRate: number
        avgClickRate: number
        avgUnsubscribeRate: number
        totalRevenue: number
    }
    recentActivity: {
        type: string
        description: string
        timestamp: Date
    }[]
}

export interface NewsletterStats {
    subscriberCount: number
    subscriberGrowth: number
    campaignCount: number
    avgOpenRate: number
    avgClickRate: number
    totalRevenue: number
    recentCampaigns: CampaignWithAnalytics[]
    topSegments: SegmentWithMembers[]
}

// ================================
// WEBHOOK PAYLOAD TYPES
// ================================

export interface WebhookPayload {
    event: string
    timestamp: Date
    organizationId: string
    data: Record<string, any>
}

export interface SubscriberWebhookPayload extends WebhookPayload {
    event: 'subscriber.created' | 'subscriber.updated' | 'subscriber.deleted' | 'subscriber.subscribed' | 'subscriber.unsubscribed'
    data: {
        subscriber: SubscriberWithNewsletters
        newsletter?: NewsletterWithStats
    }
}

export interface CampaignWebhookPayload extends WebhookPayload {
    event: 'campaign.created' | 'campaign.updated' | 'campaign.sent' | 'campaign.scheduled'
    data: {
        campaign: CampaignWithDetails
    }
}

// ================================
// EXPORT TYPES
// ================================

export type {
    User,
    Organization,
    OrganizationMember,
    Newsletter,
    Subscriber,
    NewsletterSubscriber,
    Campaign,
    CampaignRecipient,
    Template,
    Segment,
    SegmentMember,
    Automation,
    AutomationStep,
    AutomationExecution,
    CampaignAnalytics,
    SubscriberActivity,
    AbTest,
    Integration,
    Webhook,
    WebhookDelivery,
    BillingPlan,
    Invoice,
    AuditLog,
    ApiKey,
    UserRole,
    UserStatus,
    NewsletterStatus,
    SubscriberStatus,
    CampaignType,
    CampaignStatus,
    TemplateCategory,
    AutomationType,
    AutomationStatus,
    AutomationStepType,
    ActivityType,
    PlanType,
    AuditAction,
    SegmentType,
    Prisma
} from '@prisma/client'