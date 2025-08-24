
export const APP_CONFIG = {
  name: 'SendStuff',
  description: 'Enterprise Newsletter Management Platform',
  url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  api: {
    baseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000',
  },
} as const;

export const PAGINATION_LIMITS = {
  min: 1,
  max: 100,
  default: 20,
} as const;

export const SUBSCRIBER_STATUSES = {
  ACTIVE: 'Active',
  UNSUBSCRIBED: 'Unsubscribed',
  BOUNCED: 'Bounced',
} as const;

export const CAMPAIGN_STATUSES = {
  DRAFT: 'Draft',
  SCHEDULED: 'Scheduled',
  SENDING: 'Sending',
  SENT: 'Sent',
  CANCELLED: 'Cancelled',
} as const;

export const LOG_EVENTS = {
  SENT: 'Sent',
  DELIVERED: 'Delivered',
  OPENED: 'Opened',
  CLICKED: 'Clicked',
  BOUNCED: 'Bounced',
  COMPLAINED: 'Complained',
  UNSUBSCRIBED: 'Unsubscribed',
} as const;

export const USER_ROLES = {
  USER: 'User',
  ADMIN: 'Admin',
} as const;