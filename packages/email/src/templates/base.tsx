
import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from '@react-email/components';
import React from 'react';

interface BaseTemplateProps {
  preview?: string;
  children: React.ReactNode;
}

export const BaseTemplate = ({ preview, children }: BaseTemplateProps) => (
  <Html>
    <Head />
    {preview && <Preview>{preview}</Preview>}
    <Body style={main}>
      <Container style={container}>
        <Section style={header}>
          <Heading style={h1}>SendStuff</Heading>
        </Section>
        <Section style={content}>
          {children}
        </Section>
        <Section style={footer}>
          <Text style={footerText}>
            © 2024 SendStuff. All rights reserved.
          </Text>
          <Text style={footerText}>
            <Link href="#" style={link}>Unsubscribe</Link> | 
            <Link href="#" style={link}>Preferences</Link>
          </Text>
        </Section>
      </Container>
    </Body>
  </Html>
);

const main = {
  backgroundColor: '#f6f9fc',
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '20px 0 48px',
  marginBottom: '64px',
};

const header = {
  padding: '20px 30px',
  borderBottom: '1px solid #e6ebf1',
};

const h1 = {
  color: '#32325d',
  fontSize: '24px',
  fontWeight: 'normal',
  textAlign: 'center' as const,
  margin: '0',
};

const content = {
  padding: '30px',
};

const footer = {
  padding: '20px 30px',
  borderTop: '1px solid #e6ebf1',
  textAlign: 'center' as const,
};

const footerText = {
  color: '#8898aa',
  fontSize: '12px',
  lineHeight: '16px',
  margin: '0',
};

const link = {
  color: '#556cd6',
  textDecoration: 'underline',
};