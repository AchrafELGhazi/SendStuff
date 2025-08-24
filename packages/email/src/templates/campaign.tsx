
import { Heading, Text, Section } from '@react-email/components';
import React from 'react';

import { BaseTemplate } from './base';

interface CampaignEmailProps {
  subject: string;
  content: string;
  unsubscribeUrl?: string;
}

export const CampaignEmail = ({ 
  subject, 
  content, 
  unsubscribeUrl = '#' 
}: CampaignEmailProps) => (
  <BaseTemplate preview={subject}>
    <Section dangerouslySetInnerHTML={{ __html: content }} />
  </BaseTemplate>
);