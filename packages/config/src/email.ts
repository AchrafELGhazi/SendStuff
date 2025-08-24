
import { env } from './env';

export interface EmailConfig {
  provider: string;
  apiKey: string;
  from: string;
  replyTo?: string;
  templates: {
    welcome: string;
    passwordReset: string;
    emailConfirmation: string;
  };
}

export const emailConfig: EmailConfig = {
  provider: env.EMAIL_PROVIDER,
  apiKey: env.EMAIL_API_KEY,
  from: env.EMAIL_FROM,
  replyTo: env.EMAIL_FROM,
  templates: {
    welcome: 'welcome-template',
    passwordReset: 'password-reset-template',
    emailConfirmation: 'email-confirmation-template',
  },
};

export const emailLimits = {
  maxRecipientsPerBatch: 1000,
  maxEmailsPerHour: 10000,
  maxEmailsPerDay: 100000,
  retryAttempts: 3,
  retryDelay: 1000, // ms
};