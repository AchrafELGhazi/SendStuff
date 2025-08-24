
export { BaseTemplate } from './base';
export { WelcomeEmail } from './welcome';
export { CampaignEmail } from './campaign';

import { WelcomeEmail } from './welcome';
import { CampaignEmail } from './campaign';
import type { EmailTemplate } from '../types';

export const emailTemplates: EmailTemplate[] = [
  {
    name: 'welcome',
    subject: 'Welcome to SendStuff!',
    component: WelcomeEmail,
  },
  {
    name: 'campaign',
    subject: 'Campaign Email',
    component: CampaignEmail,
  },
];