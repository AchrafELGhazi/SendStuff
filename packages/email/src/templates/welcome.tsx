
import { Button, Heading, Text } from '@react-email/components';
import React from 'react';

import { BaseTemplate } from './base';

interface WelcomeEmailProps {
  name?: string;
  loginUrl?: string;
}

export const WelcomeEmail = ({ name = 'there', loginUrl = '#' }: WelcomeEmailProps) => (
  <BaseTemplate preview={`Welcome to SendStuff, ${name}!`}>
    <Heading style={h2}>Welcome to SendStuff!</Heading>
    <Text style={text}>
      Hi {name},
    </Text>
    <Text style={text}>
      Welcome to SendStuff! We're excited to have you on board. 
      Our platform makes it easy to create, manage, and send beautiful newsletters 
      to your subscribers.
    </Text>
    <Text style={text}>
      Get started by exploring your dashboard and creating your first campaign.
    </Text>
    <Button style={button} href={loginUrl}>
      Get Started
    </Button>
    <Text style={text}>
      If you have any questions, feel free to reach out to our support team.
    </Text>
    <Text style={text}>
      Best regards,<br />
      The SendStuff Team
    </Text>
  </BaseTemplate>
);

const h2 = {
  color: '#32325d',
  fontSize: '20px',
  fontWeight: 'normal',
  margin: '0 0 20px',
};

const text = {
  color: '#525f7f',
  fontSize: '16px',
  lineHeight: '24px',
  margin: '0 0 16px',
};

const button = {
  backgroundColor: '#556cd6',
  borderRadius: '5px',
  color: '#fff',
  fontSize: '16px',
  fontWeight: 'bold',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'block',
  width: '200px',
  padding: '12px',
  margin: '20px 0',
};