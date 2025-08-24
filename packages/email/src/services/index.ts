
import { emailConfig } from '@sendstuff/config';

import { ResendService } from './resend';
import type { EmailService } from '../types';

export * from './resend';

export function createEmailService(): EmailService {
  switch (emailConfig.provider) {
    case 'resend':
      return new ResendService(emailConfig.apiKey);
    default:
      throw new Error(`Unsupported email provider: ${emailConfig.provider}`);
  }
}