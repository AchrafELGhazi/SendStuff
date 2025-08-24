
import { render } from '@react-email/render';
import { Resend } from 'resend';

import type { EmailOptions, EmailService } from '../types';

export class ResendService implements EmailService {
  private resend: Resend;

  constructor(apiKey: string) {
    this.resend = new Resend(apiKey);
  }

  async send(options: EmailOptions) {
    try {
      const { data, error } = await this.resend.emails.send({
        from: options.from || 'SendStuff <no-reply@sendstuff.com>',
        to: Array.isArray(options.to) ? options.to : [options.to],
        subject: options.subject,
        html: options.html,
        text: options.text,
        reply_to: options.replyTo,
        cc: options.cc,
        bcc: options.bcc,
        attachments: options.attachments,
      });

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, messageId: data?.id };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  async sendBatch(emails: EmailOptions[]) {
    const results = await Promise.allSettled(
      emails.map(email => this.send(email))
    );

    return {
      success: results.every(result => 
        result.status === 'fulfilled' && result.value.success
      ),
      results: results.map(result => 
        result.status === 'fulfilled' 
          ? result.value 
          : { success: false, error: 'Promise rejected' }
      ),
    };
  }
}