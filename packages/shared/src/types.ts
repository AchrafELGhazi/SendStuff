
// Re-export database types
export type {
  User,
  Subscriber,
  Campaign,
  CampaignLog,
  Role,
  SubscriberStatus,
  CampaignStatus,
  LogEvent,
  UserWithStats,
  CampaignWithStats,
  SubscriberWithLogs,
  CreateCampaignRequest,
  CreateSubscriberRequest,
  UpdateSubscriberRequest,
} from '@sendstuff/database';

// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginationParams {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// Email template types
export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  htmlContent: string;
  textContent?: string;
  variables: Record<string, string>;
}

// Dashboard stats
export interface DashboardStats {
  totalSubscribers: number;
  totalCampaigns: number;
  deliveryRate: number;
  openRate: number;
  clickRate: number;
  recentActivity: ActivityItem[];
}

export interface ActivityItem {
  id: string;
  type: 'campaign_sent' | 'subscriber_added' | 'campaign_created';
  message: string;
  timestamp: string;
}