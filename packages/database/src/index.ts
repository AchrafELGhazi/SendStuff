// Main database exports
export { default as prisma } from './client'
export { prisma as db } from './client'

// Export all types
export * from './types'

// Re-export Prisma types and enums
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
    Prisma
} from '@prisma/client'

export {
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
    SegmentType
} from '@prisma/client'

// Database utilities and helpers
export const DATABASE_CONSTANTS = {
    DEFAULT_PAGE_SIZE: 20,
    MAX_PAGE_SIZE: 100,
    DEFAULT_SORT_ORDER: 'desc' as const,
    SUBSCRIBER_LIMITS: {
        FREE: 1000,
        STARTER: 5000,
        PROFESSIONAL: 25000,
        ENTERPRISE: -1 // unlimited
    },
    EMAIL_LIMITS: {
        FREE: 10000,
        STARTER: 50000,
        PROFESSIONAL: 250000,
        ENTERPRISE: -1 // unlimited
    }
} as const

// Common database queries helpers
export const dbHelpers = {
    // Pagination helper
    getPaginationParams: (page: number = 1, limit: number = DATABASE_CONSTANTS.DEFAULT_PAGE_SIZE) => ({
        skip: (page - 1) * limit,
        take: Math.min(limit, DATABASE_CONSTANTS.MAX_PAGE_SIZE)
    }),

    // Calculate pagination metadata
    getPaginationMeta: (page: number, limit: number, total: number) => ({
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNext: page * limit < total,
        hasPrev: page > 1
    }),

    // Common select fields for user
    userSelect: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        avatar: true,
        status: true,
        createdAt: true,
        updatedAt: true
    },

    // Common select fields for organization
    organizationSelect: {
        id: true,
        name: true,
        slug: true,
        logo: true,
        createdAt: true,
        updatedAt: true
    },

    // Common select fields for newsletter
    newsletterSelect: {
        id: true,
        name: true,
        description: true,
        slug: true,
        fromName: true,
        fromEmail: true,
        status: true,
        createdAt: true,
        updatedAt: true
    },

    // Common select fields for subscriber
    subscriberSelect: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        customFields: true,
        createdAt: true,
        updatedAt: true
    }
}