
import { z } from 'zod';

// User validations
export const createUserSchema = z.object({
  email: z.string().email('Invalid email address'),
  name: z.string().min(1, 'Name is required').optional(),
  role: z.enum(['USER', 'ADMIN']).optional(),
});

export const updateUserSchema = createUserSchema.partial();

// Subscriber validations
export const createSubscriberSchema = z.object({
  email: z.string().email('Invalid email address'),
  name: z.string().min(1, 'Name must be at least 1 character').optional(),
  tags: z.array(z.string()).optional(),
  metadata: z.record(z.any()).optional(),
});

export const updateSubscriberSchema = z.object({
  name: z.string().min(1, 'Name must be at least 1 character').optional(),
  status: z.enum(['ACTIVE', 'UNSUBSCRIBED', 'BOUNCED']).optional(),
  tags: z.array(z.string()).optional(),
  metadata: z.record(z.any()).optional(),
});

// Campaign validations
export const createCampaignSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  subject: z.string().min(1, 'Subject is required'),
  content: z.string().min(1, 'Content is required'),
  htmlContent: z.string().optional(),
  scheduledAt: z.string().datetime().optional(),
});

export const updateCampaignSchema = createCampaignSchema.partial();

// Pagination validation
export const paginationSchema = z.object({
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(20),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

// Email template validation
export const emailTemplateSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  subject: z.string().min(1, 'Subject is required'),
  htmlContent: z.string().min(1, 'HTML content is required'),
  textContent: z.string().optional(),
  variables: z.record(z.string()).default({}),
});