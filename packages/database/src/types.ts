
import type {
    User,
    Subscriber,
    Campaign,
    CampaignLog,
    Role,
    SubscriberStatus,
    CampaignStatus,
    LogEvent
} from './generated';

export type {
    User,
    Subscriber,
    Campaign,
    CampaignLog,
    Role,
    SubscriberStatus,
    CampaignStatus,
    LogEvent,
};

// Extended types for API responses
export interface UserWithStats extends User {
    _count: {
        campaigns: number;
        subscribers: number;
    };
}

export interface CampaignWithStats extends Campaign {
    _count: {
        campaignLogs: number;
    };
    stats: {
        sent: number;
        delivered: number;
        opened: number;
        clicked: number;
        bounced: number;
    };
}

export interface SubscriberWithLogs extends Subscriber {
    campaignLogs: CampaignLog[];
}

// API Request/Response types
export interface CreateCampaignRequest {
    title: string;
    subject: string;
    content: string;
    htmlContent?: string;
    scheduledAt?: string;
}

export interface CreateSubscriberRequest {
    email: string;
    name?: string;
    tags?: string[];
    metadata?: Record<string, any>;
}

export interface UpdateSubscriberRequest {
    name?: string;
    status?: SubscriberStatus;
    tags?: string[];
    metadata?: Record<string, any>;
}