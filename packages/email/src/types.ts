
export interface EmailOptions {
  to: string | string[];
  from?: string;
  subject: string;
  html?: string;
  text?: string;
  replyTo?: string;
  cc?: string[];
  bcc?: string[];
  attachments?: Attachment[];
}

export interface Attachment {
  filename: string;
  content: string | Buffer;
  contentType?: string;
}

export interface TemplateProps {
  [key: string]: any;
}

export interface EmailTemplate {
  name: string;
  subject: string;
  component: React.ComponentType<any>;
}

export interface EmailService {
  send(options: EmailOptions): Promise<{ success: boolean; messageId?: string; error?: string }>;
  sendBatch(emails: EmailOptions[]): Promise<{ success: boolean; results: Array<{ success: boolean; messageId?: string; error?: string }> }>;
}