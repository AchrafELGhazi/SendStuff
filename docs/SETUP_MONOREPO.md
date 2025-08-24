# SendStuff: Enterprise Monorepo Setup Guide

## 🎯 Project Overview

**SendStuff** is a highly scalable, enterprise-grade newsletter management platform built with modern architecture patterns. This monorepo leverages Turborepo for build orchestration, featuring a microservices-oriented design with shared packages for maximum code reuse and maintainability.

### Architecture Highlights

- **Monorepo Management**: Turborepo with intelligent caching and parallel execution
- **Frontend**: Next.js 14+ with App Router, TypeScript, Tailwind CSS
- **Backend**: Express.js with Clean Architecture patterns
- **Database**: PostgreSQL with Prisma ORM and migrations
- **Shared Libraries**: Type-safe contracts and utilities
- **Scalability**: Horizontal scaling ready with worker processes
- **Developer Experience**: Hot reloading, type checking, linting, and testing

## 📁 Project Structure

```
sendstuff/
├── apps/
│   ├── web/                    # Next.js Frontend
│   ├── api/                    # Express.js API Server
│   ├── worker/                 # Background Job Processor
│   └── docs/                   # Documentation Site
├── packages/
│   ├── shared/                 # Shared Types & Utils
│   ├── database/               # Prisma Schema & Migrations
│   ├── email/                  # Email Templates & Services
│   ├── config/                 # Shared Configurations
│   └── ui/                     # Shared UI Components
├── tools/
│   ├── eslint-config/          # Shared ESLint Config
│   ├── typescript-config/      # Shared TypeScript Configs
│   └── tailwind-config/        # Shared Tailwind Config
├── docker/                     # Docker Configurations
├── scripts/                    # Build & Deployment Scripts
├── .github/                    # GitHub Actions
└── docs/                       # Additional Documentation
```

## 🚀 Prerequisites

Ensure you have the following installed:

- **Node.js**: v18.17.0 or later
- **pnpm**: v8.0.0 or later
- **Docker**: v20.0.0 or later
- **PostgreSQL**: v14 or later (or Docker)
- **Git**: Latest version

```bash
# Install Node.js (using nvm)
nvm install 18.17.0
nvm use 18.17.0

# Install pnpm globally
npm install -g pnpm@latest

# Verify installations
node --version
pnpm --version
docker --version
```

## 📦 Step 1: Initialize Monorepo Foundation

### 1.1 Create Project Root

```bash
mkdir sendstuff
cd sendstuff
pnpm init
```

### 1.2 Configure Workspace

Create `pnpm-workspace.yaml`:

```yaml
packages:
  - 'apps/*'
  - 'packages/*'
  - 'tools/*'
```

### 1.3 Install Core Dependencies

```bash
# Install Turborepo and essential tools
pnpm add -D turbo
pnpm add -D typescript
pnpm add -D @types/node
pnpm add -D rimraf
pnpm add -D concurrently

# Install shared development dependencies
pnpm add -D prettier
pnpm add -D eslint
pnpm add -D @typescript-eslint/eslint-plugin
pnpm add -D @typescript-eslint/parser
```

### 1.4 Configure Turborepo

Create `turbo.json`:

```json
{
  "$schema": "https://turbo.build/schema.json",
  "globalDependencies": ["**/.env.*local"],
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": [
        "dist/**",
        ".next/**",
        "!.next/cache/**",
        "build/**"
      ]
    },
    "dev": {
      "cache": false,
      "persistent": true
    },
    "test": {
      "dependsOn": ["^build"],
      "outputs": ["coverage/**"]
    },
    "lint": {
      "outputs": []
    },
    "type-check": {
      "dependsOn": ["^build"],
      "outputs": []
    },
    "clean": {
      "cache": false
    },
    "db:generate": {
      "cache": false
    },
    "db:migrate": {
      "cache": false
    },
    "db:seed": {
      "cache": false
    }
  }
}
```

## 🔧 Step 2: Shared Configurations

### 2.1 TypeScript Configurations

Create `tools/typescript-config/package.json`:

```json
{
  "name": "@sendstuff/typescript-config",
  "version": "1.0.0",
  "private": true,
  "main": "index.js",
  "files": ["*.json"]
}
```

Create `tools/typescript-config/base.json`:

```json
{
  "$schema": "https://json.schemastore.org/tsconfig",
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["ES2022"],
    "module": "ESNext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "allowJs": true,
    "checkJs": false,
    "outDir": "dist",
    "rootDir": ".",
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitOverride": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "noUncheckedSideEffectImports": true,
    "useDefineForClassFields": true,
    "forceConsistentCasingInFileNames": true,
    "skipLibCheck": true,
    "allowSyntheticDefaultImports": true,
    "esModuleInterop": true,
    "isolatedModules": true,
    "verbatimModuleSyntax": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "incremental": true,
    "tsBuildInfoFile": "node_modules/.cache/tsbuildinfo.json",
    "baseUrl": ".",
    "paths": {
      "@sendstuff/shared": ["packages/shared/src/index.ts"],
      "@sendstuff/database": ["packages/database/src/index.ts"],
      "@sendstuff/email": ["packages/email/src/index.ts"],
      "@sendstuff/config": ["packages/config/src/index.ts"],
      "@sendstuff/ui": ["packages/ui/src/index.ts"]
    }
  },
  "exclude": [
    "node_modules",
    "dist",
    "build",
    ".next",
    "coverage"
  ]
}
```

Create `tools/typescript-config/nextjs.json`:

```json
{
  "extends": "./base.json",
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["DOM", "DOM.Iterable", "ES2017"],
    "module": "ESNext",
    "moduleResolution": "bundler",
    "jsx": "preserve",
    "plugins": [
      {
        "name": "next"
      }
    ]
  },
  "include": [
    "next-env.d.ts",
    "**/*.ts",
    "**/*.tsx",
    ".next/types/**/*.ts"
  ]
}
```

Create `tools/typescript-config/node.json`:

```json
{
  "extends": "./base.json",
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["ES2022"],
    "module": "CommonJS",
    "moduleResolution": "node",
    "types": ["node"]
  },
  "include": ["src/**/*"],
  "exclude": ["**/*.test.ts", "**/*.spec.ts"]
}
```

### 2.2 ESLint Configuration

Create `tools/eslint-config/package.json`:

```json
{
  "name": "@sendstuff/eslint-config",
  "version": "1.0.0",
  "private": true,
  "main": "index.js",
  "dependencies": {
    "@typescript-eslint/eslint-plugin": "^6.0.0",
    "@typescript-eslint/parser": "^6.0.0",
    "eslint-config-next": "^14.0.0",
    "eslint-config-prettier": "^9.0.0",
    "eslint-plugin-import": "^2.29.0",
    "eslint-plugin-jsx-a11y": "^6.8.0",
    "eslint-plugin-react": "^7.33.0",
    "eslint-plugin-react-hooks": "^4.6.0"
  }
}
```

Create `tools/eslint-config/base.js`:

```javascript
module.exports = {
  env: {
    node: true,
    es2022: true,
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint', 'import'],
  extends: [
    'eslint:recommended',
    '@typescript-eslint/recommended',
    'eslint-config-prettier',
  ],
  rules: {
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    '@typescript-eslint/consistent-type-imports': [
      'error',
      { prefer: 'type-imports', fixStyle: 'inline-type-imports' },
    ],
    'import/order': [
      'error',
      {
        groups: [
          'builtin',
          'external',
          'internal',
          'parent',
          'sibling',
          'index',
        ],
        'newlines-between': 'always',
        alphabetize: { order: 'asc' },
      },
    ],
  },
  ignorePatterns: ['dist', 'build', '.next', 'node_modules'],
};
```

Create `tools/eslint-config/nextjs.js`:

```javascript
module.exports = {
  extends: ['./base.js', 'next/core-web-vitals'],
  env: {
    browser: true,
    node: true,
  },
  rules: {
    '@next/next/no-html-link-for-pages': 'off',
  },
};
```

### 2.3 Tailwind Configuration

Create `tools/tailwind-config/package.json`:

```json
{
  "name": "@sendstuff/tailwind-config",
  "version": "1.0.0",
  "private": true,
  "main": "index.js",
  "dependencies": {
    "tailwindcss": "^3.4.0"
  }
}
```

Create `tools/tailwind-config/index.js`:

```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    '../../packages/ui/src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          900: '#1e3a8a',
        },
        secondary: {
          50: '#f8fafc',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          900: '#0f172a',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
    },
  },
  plugins: [],
};
```

## 📊 Step 3: Database Package Setup

### 3.1 Initialize Database Package

```bash
mkdir -p packages/database/src
cd packages/database
pnpm init
```

Create `packages/database/package.json`:

```json
{
  "name": "@sendstuff/database",
  "version": "1.0.0",
  "private": true,
  "main": "src/index.ts",
  "scripts": {
    "db:generate": "prisma generate",
    "db:push": "prisma db push",
    "db:migrate": "prisma migrate dev",
    "db:deploy": "prisma migrate deploy",
    "db:seed": "tsx src/seed.ts",
    "db:studio": "prisma studio",
    "db:reset": "prisma migrate reset"
  },
  "dependencies": {
    "@prisma/client": "^5.7.0"
  },
  "devDependencies": {
    "prisma": "^5.7.0",
    "tsx": "^4.0.0",
    "@faker-js/faker": "^8.3.0"
  }
}
```

### 3.2 Prisma Schema

Create `packages/database/prisma/schema.prisma`:

```prisma
// This is your Prisma schema file
generator client {
  provider = "prisma-client-js"
  output   = "../src/generated"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String?
  avatar    String?
  role      Role     @default(USER)
  createdAt DateTime @default(now()) @map("created_at")
  updatedAt DateTime @updatedAt @map("updated_at")

  // Relations
  campaigns   Campaign[]
  subscribers Subscriber[]

  @@map("users")
}

model Subscriber {
  id         String            @id @default(cuid())
  email      String
  name       String?
  status     SubscriberStatus  @default(ACTIVE)
  metadata   Json?
  tags       String[]
  createdAt  DateTime          @default(now()) @map("created_at")
  updatedAt  DateTime          @updatedAt @map("updated_at")

  // Relations
  userId       String @map("user_id")
  user         User   @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  campaignLogs CampaignLog[]

  @@unique([email, userId])
  @@map("subscribers")
}

model Campaign {
  id          String         @id @default(cuid())
  title       String
  subject     String
  content     String
  htmlContent String?        @map("html_content")
  status      CampaignStatus @default(DRAFT)
  scheduledAt DateTime?      @map("scheduled_at")
  sentAt      DateTime?      @map("sent_at")
  createdAt   DateTime       @default(now()) @map("created_at")
  updatedAt   DateTime       @updatedAt @map("updated_at")

  // Relations
  userId String @map("user_id")
  user   User   @relation(fields: [userId], references: [id], onDelete: Cascade)

  campaignLogs CampaignLog[]

  @@map("campaigns")
}

model CampaignLog {
  id         String      @id @default(cuid())
  event      LogEvent
  metadata   Json?
  createdAt  DateTime    @default(now()) @map("created_at")

  // Relations
  campaignId   String     @map("campaign_id")
  campaign     Campaign   @relation(fields: [campaignId], references: [id], onDelete: Cascade)
  
  subscriberId String     @map("subscriber_id")
  subscriber   Subscriber @relation(fields: [subscriberId], references: [id], onDelete: Cascade)

  @@map("campaign_logs")
}

enum Role {
  USER
  ADMIN
}

enum SubscriberStatus {
  ACTIVE
  UNSUBSCRIBED
  BOUNCED
}

enum CampaignStatus {
  DRAFT
  SCHEDULED
  SENDING
  SENT
  CANCELLED
}

enum LogEvent {
  SENT
  DELIVERED
  OPENED
  CLICKED
  BOUNCED
  COMPLAINED
  UNSUBSCRIBED
}
```

### 3.3 Database Client

Create `packages/database/src/index.ts`:

```typescript
export * from './generated';
export * from './client';
export * from './types';
```

Create `packages/database/src/client.ts`:

```typescript
import { PrismaClient } from './generated';

declare global {
  var __prisma: PrismaClient | undefined;
}

export const prisma =
  globalThis.__prisma ||
  new PrismaClient({
    log: ['query'],
  });

if (process.env.NODE_ENV !== 'production') {
  globalThis.__prisma = prisma;
}
```

Create `packages/database/src/types.ts`:

```typescript
import type { 
  User, 
  Subscriber, 
  Campaign, 
  CampaignLog,
  Role,
  SubscriberStatus,
  CampaignStatus,
  LogEvent
} from './generated';

export type {
  User,
  Subscriber,
  Campaign,
  CampaignLog,
  Role,
  SubscriberStatus,
  CampaignStatus,
  LogEvent,
};

// Extended types for API responses
export interface UserWithStats extends User {
  _count: {
    campaigns: number;
    subscribers: number;
  };
}

export interface CampaignWithStats extends Campaign {
  _count: {
    campaignLogs: number;
  };
  stats: {
    sent: number;
    delivered: number;
    opened: number;
    clicked: number;
    bounced: number;
  };
}

export interface SubscriberWithLogs extends Subscriber {
  campaignLogs: CampaignLog[];
}

// API Request/Response types
export interface CreateCampaignRequest {
  title: string;
  subject: string;
  content: string;
  htmlContent?: string;
  scheduledAt?: string;
}

export interface CreateSubscriberRequest {
  email: string;
  name?: string;
  tags?: string[];
  metadata?: Record<string, any>;
}

export interface UpdateSubscriberRequest {
  name?: string;
  status?: SubscriberStatus;
  tags?: string[];
  metadata?: Record<string, any>;
}
```

### 3.4 Database Seed

Create `packages/database/src/seed.ts`:

```typescript
import { faker } from '@faker-js/faker';

import { prisma } from './client';

async function main() {
  console.log('🌱 Seeding database...');

  // Create admin user
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@sendstuff.com' },
    update: {},
    create: {
      email: 'admin@sendstuff.com',
      name: 'Admin User',
      role: 'ADMIN',
    },
  });

  console.log('👤 Created admin user:', adminUser.email);

  // Create subscribers
  const subscribers = await Promise.all(
    Array.from({ length: 100 }, async () => {
      const email = faker.internet.email();
      const name = faker.person.fullName();
      
      return prisma.subscriber.create({
        data: {
          email,
          name,
          userId: adminUser.id,
          tags: faker.helpers.arrayElements(['newsletter', 'marketing', 'product'], { min: 0, max: 3 }),
          metadata: {
            source: faker.helpers.arrayElement(['website', 'api', 'import']),
            signupDate: faker.date.past(),
          },
        },
      });
    })
  );

  console.log(`📧 Created ${subscribers.length} subscribers`);

  // Create campaigns
  const campaigns = await Promise.all(
    Array.from({ length: 10 }, async () => {
      return prisma.campaign.create({
        data: {
          title: faker.company.catchPhrase(),
          subject: faker.lorem.sentence(),
          content: faker.lorem.paragraphs(3),
          htmlContent: `<div>${faker.lorem.paragraphs(3, '<p>')}</p></div>`,
          status: faker.helpers.arrayElement(['DRAFT', 'SENT', 'SCHEDULED']),
          userId: adminUser.id,
          scheduledAt: faker.helpers.maybe(() => faker.date.future(), { probability: 0.3 }),
          sentAt: faker.helpers.maybe(() => faker.date.past(), { probability: 0.6 }),
        },
      });
    })
  );

  console.log(`📨 Created ${campaigns.length} campaigns`);

  console.log('✅ Database seeded successfully!');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
```

### 3.5 TypeScript Configuration

Create `packages/database/tsconfig.json`:

```json
{
  "extends": "@sendstuff/typescript-config/base.json",
  "compilerOptions": {
    "outDir": "dist",
    "rootDir": "src"
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

## 🎨 Step 4: Shared Packages

### 4.1 Shared Types & Utilities

Create `packages/shared/package.json`:

```json
{
  "name": "@sendstuff/shared",
  "version": "1.0.0",
  "private": true,
  "main": "src/index.ts",
  "types": "src/index.ts",
  "scripts": {
    "type-check": "tsc --noEmit",
    "lint": "eslint src --ext .ts"
  },
  "dependencies": {
    "zod": "^3.22.0",
    "date-fns": "^3.0.0"
  },
  "devDependencies": {
    "@sendstuff/typescript-config": "workspace:*",
    "@sendstuff/eslint-config": "workspace:*",
    "typescript": "^5.3.0"
  }
}
```

Create `packages/shared/src/index.ts`:

```typescript
export * from './types';
export * from './validations';
export * from './utils';
export * from './constants';
```

Create `packages/shared/src/types.ts`:

```typescript
// Re-export database types
export type {
  User,
  Subscriber,
  Campaign,
  CampaignLog,
  Role,
  SubscriberStatus,
  CampaignStatus,
  LogEvent,
  UserWithStats,
  CampaignWithStats,
  SubscriberWithLogs,
  CreateCampaignRequest,
  CreateSubscriberRequest,
  UpdateSubscriberRequest,
} from '@sendstuff/database';

// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginationParams {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// Email template types
export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  htmlContent: string;
  textContent?: string;
  variables: Record<string, string>;
}

// Dashboard stats
export interface DashboardStats {
  totalSubscribers: number;
  totalCampaigns: number;
  deliveryRate: number;
  openRate: number;
  clickRate: number;
  recentActivity: ActivityItem[];
}

export interface ActivityItem {
  id: string;
  type: 'campaign_sent' | 'subscriber_added' | 'campaign_created';
  message: string;
  timestamp: string;
}
```

Create `packages/shared/src/validations.ts`:

```typescript
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
```

Create `packages/shared/src/utils.ts`:

```typescript
import { format, formatDistanceToNow } from 'date-fns';

export function formatDate(date: Date | string): string {
  return format(new Date(date), 'MMM dd, yyyy');
}

export function formatDateTime(date: Date | string): string {
  return format(new Date(date), 'MMM dd, yyyy HH:mm');
}

export function formatRelativeTime(date: Date | string): string {
  return formatDistanceToNow(new Date(date), { addSuffix: true });
}

export function generateId(): string {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
}

export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
}

export function calculateDeliveryRate(sent: number, bounced: number): number {
  if (sent === 0) return 0;
  return ((sent - bounced) / sent) * 100;
}

export function calculateOpenRate(delivered: number, opened: number): number {
  if (delivered === 0) return 0;
  return (opened / delivered) * 100;
}

export function calculateClickRate(delivered: number, clicked: number): number {
  if (delivered === 0) return 0;
  return (clicked / delivered) * 100;
}

export function parseQueryParam(param: string | string[] | undefined): string | undefined {
  return Array.isArray(param) ? param[0] : param;
}

export function parseNumberParam(param: string | string[] | undefined, defaultValue: number): number {
  const parsed = parseQueryParam(param);
  if (!parsed) return defaultValue;
  const number = parseInt(parsed, 10);
  return isNaN(number) ? defaultValue : number;
}
```

Create `packages/shared/src/constants.ts`:

```typescript
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
```

### 4.2 Configuration Package

Create `packages/config/package.json`:

```json
{
  "name": "@sendstuff/config",
  "version": "1.0.0",
  "private": true,
  "main": "src/index.ts",
  "types": "src/index.ts",
  "dependencies": {
    "dotenv": "^16.3.0",
    "zod": "^3.22.0"
  }
}
```

Create `packages/config/src/index.ts`:

```typescript
export * from './env';
export * from './database';
export * from './email';
```

Create `packages/config/src/env.ts`:

```typescript
import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  DATABASE_URL: z.string().url(),
  JWT_SECRET: z.string().min(32),
  REDIS_URL: z.string().url().optional(),
  EMAIL_PROVIDER: z.enum(['resend', 'sendgrid', 'ses']).default('resend'),
  EMAIL_FROM: z.string().email(),
  EMAIL_API_KEY: z.string(),
  NEXT_PUBLIC_APP_URL: z.string().url(),
  NEXT_PUBLIC_API_URL: z.string().url(),
  PORT: z.coerce.number().default(5000),
  WEB_PORT: z.coerce.number().default(3000),
});

export type Env = z.infer<typeof envSchema>;

export function validateEnv(): Env {
  try {
    return envSchema.parse(process.env);
  } catch (error) {
    console.error('❌ Invalid environment variables:', error);
    process.exit(1);
  }
}

export const env = validateEnv();
```

Create `packages/config/src/database.ts`:

```typescript
import type { PrismaClientOptions } from '@prisma/client/runtime/library';

import { env } from './env';

export const databaseConfig: PrismaClientOptions = {
  log: env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  errorFormat: 'pretty',
};

export const connectionPoolConfig = {
  max: env.NODE_ENV === 'production' ? 20 : 5,
  min: 1,
  acquireTimeoutMillis: 30000,
  createTimeoutMillis: 30000,
  destroyTimeoutMillis: 5000,
  idleTimeoutMillis: 30000,
  reapIntervalMillis: 1000,
  createRetryIntervalMillis: 200,
};
```

Create `packages/config/src/email.ts`:

```typescript
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
```

### 4.3 Email Templates Package

Create `packages/email/package.json`:

```json
{
  "name": "@sendstuff/email",
  "version": "1.0.0",
  "private": true,
  "main": "src/index.ts",
  "types": "src/index.ts",
  "scripts": {
    "dev": "tsx watch src/preview.ts",
    "build": "tsc",
    "type-check": "tsc --noEmit"
  },
  "dependencies": {
    "@react-email/components": "^0.0.12",
    "@react-email/render": "^0.0.10",
    "react": "^18.2.0",
    "resend": "^2.1.0"
  },
  "devDependencies": {
    "@sendstuff/typescript-config": "workspace:*",
    "@types/react": "^18.2.0",
    "tsx": "^4.0.0",
    "typescript": "^5.3.0"
  }
}
```

Create `packages/email/src/index.ts`:

```typescript
export * from './templates';
export * from './services';
export * from './types';
```

Create `packages/email/src/types.ts`:

```typescript
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
```

Create `packages/email/src/templates/base.tsx`:

```typescript
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
            © 2025 SendStuff. All rights reserved.
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
```

Create `packages/email/src/templates/welcome.tsx`:

```typescript
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
```

Create `packages/email/src/templates/campaign.tsx`:

```typescript
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
```

Create `packages/email/src/templates/index.ts`:

```typescript
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
```

Create `packages/email/src/services/resend.ts`:

```typescript
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
```

Create `packages/email/src/services/index.ts`:

```typescript
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
```

## 🚀 Step 5: Backend API Setup

### 5.1 Initialize API Application

```bash
mkdir -p apps/api/src
cd apps/api
pnpm init
```

Create `apps/api/package.json`:

```json
{
  "name": "@sendstuff/api",
  "version": "1.0.0",
  "private": true,
  "main": "src/index.ts",
  "scripts": {
    "dev": "tsx watch src/index.ts",
    "build": "tsc",
    "start": "node dist/index.js",
    "type-check": "tsc --noEmit",
    "lint": "eslint src --ext .ts,.tsx --report-unused-disable-directives --max-warnings 0"
  },
  "dependencies": {
    "@sendstuff/config": "workspace:*",
    "@sendstuff/database": "workspace:*",
    "@sendstuff/shared": "workspace:*",
    "@sendstuff/email": "workspace:*",
    "express": "^4.18.2",
    "cors": "^2.8.5",
    "helmet": "^7.1.0",
    "compression": "^1.7.4",
    "express-rate-limit": "^7.1.0",
    "express-validator": "^7.0.1",
    "jsonwebtoken": "^9.0.2",
    "bcryptjs": "^2.4.3",
    "morgan": "^1.10.0",
    "dotenv": "^16.3.0",
    "winston": "^3.11.0",
    "bull": "^4.12.0",
    "redis": "^4.6.0"
  },
  "devDependencies": {
    "@sendstuff/typescript-config": "workspace:*",
    "@sendstuff/eslint-config": "workspace:*",
    "@types/express": "^4.17.21",
    "@types/cors": "^2.8.17",
    "@types/compression": "^1.7.5",
    "@types/jsonwebtoken": "^9.0.5",
    "@types/bcryptjs": "^2.4.6",
    "@types/morgan": "^1.9.9",
    "tsx": "^4.0.0",
    "typescript": "^5.3.0"
  }
}
```

### 5.2 API Application Structure

Create `apps/api/src/index.ts`:

```typescript
import dotenv from 'dotenv';

// Load environment variables first
dotenv.config();

import { app } from './app';
import { env } from '@sendstuff/config';
import { logger } from './utils/logger';

const PORT = env.PORT;

async function startServer() {
  try {
    app.listen(PORT, () => {
      logger.info(`🚀 API Server running on port ${PORT}`);
      logger.info(`📊 Environment: ${env.NODE_ENV}`);
      logger.info(`🔗 API URL: http://localhost:${PORT}`);
    });
  } catch (error) {
    logger.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  logger.info('SIGINT received, shutting down gracefully');
  process.exit(0);
});

startServer();
```

Create `apps/api/src/app.ts`:

```typescript
import compression from 'compression';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';

import { env } from '@sendstuff/config';

import { errorHandler } from './middleware/error-handler';
import { rateLimiter } from './middleware/rate-limiter';
import { apiRouter } from './routes';
import { logger } from './utils/logger';

export const app = express();

// Security middleware
app.use(helmet());
app.use(cors({
  origin: env.NODE_ENV === 'production' 
    ? [env.NEXT_PUBLIC_APP_URL] 
    : ['http://localhost:3000', 'http://localhost:3001'],
  credentials: true,
}));

// General middleware
app.use(compression());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Logging
app.use(morgan('combined', {
  stream: { write: message => logger.info(message.trim()) }
}));

// Rate limiting
app.use(rateLimiter);

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'SendStuff API is healthy',
    timestamp: new Date().toISOString(),
    environment: env.NODE_ENV,
  });
});

// API routes
app.use('/api', apiRouter);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route not found',
  });
});

// Error handling
app.use(errorHandler);
```

Create `apps/api/src/utils/logger.ts`:

```typescript
import winston from 'winston';

import { env } from '@sendstuff/config';

const logFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.json()
);

export const logger = winston.createLogger({
  level: env.NODE_ENV === 'production' ? 'info' : 'debug',
  format: logFormat,
  defaultMeta: { service: 'sendstuff-api' },
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      ),
    }),
    new winston.transports.File({ 
      filename: 'logs/error.log', 
      level: 'error' 
    }),
    new winston.transports.File({ 
      filename: 'logs/combined.log' 
    }),
  ],
});
```

Create `apps/api/src/middleware/error-handler.ts`:

```typescript
import type { ErrorRequestHandler } from 'express';

import { logger } from '../utils/logger';

export const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  logger.error('Unhandled error:', {
    error: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    body: req.body,
  });

  // Don't leak error details in production
  const message = process.env.NODE_ENV === 'production' 
    ? 'Internal server error' 
    : err.message;

  res.status(err.status || 500).json({
    success: false,
    error: message,
  });
};
```

Create `apps/api/src/middleware/rate-limiter.ts`:

```typescript
import rateLimit from 'express-rate-limit';

export const rateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    success: false,
    error: 'Too many requests, please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});
```

Create `apps/api/src/middleware/auth.ts`:

```typescript
import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

import { env } from '@sendstuff/config';
import { prisma } from '@sendstuff/database';

interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

export const authenticate = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({
        success: false,
        error: 'Access denied. No token provided.',
      });
    }

    const decoded = jwt.verify(token, env.JWT_SECRET) as {
      userId: string;
      email: string;
      role: string;
    };

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { id: true, email: true, role: true },
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Invalid token.',
      });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      error: 'Invalid token.',
    });
  }
};

export const authorize = (roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'Authentication required.',
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: 'Insufficient permissions.',
      });
    }

    next();
  };
};
```

Create `apps/api/src/routes/index.ts`:

```typescript
import { Router } from 'express';

import { authRouter } from './auth';
import { campaignsRouter } from './campaigns';
import { subscribersRouter } from './subscribers';
import { usersRouter } from './users';

export const apiRouter = Router();

apiRouter.use('/auth', authRouter);
apiRouter.use('/campaigns', campaignsRouter);
apiRouter.use('/subscribers', subscribersRouter);
apiRouter.use('/users', usersRouter);
```

Create `apps/api/src/routes/auth.ts`:

```typescript
import { Router } from 'express';
import { body, validationResult } from 'express-validator';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import { env } from '@sendstuff/config';
import { prisma } from '@sendstuff/database';

export const authRouter = Router();

// Register
authRouter.post('/register', [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 }),
  body('name').optional().trim().escape(),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: errors.array(),
      });
    }

    const { email, password, name } = req.body;

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: 'User already exists',
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        name,
        // Note: Add password field to schema if implementing auth
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
      },
    });

    // Generate JWT
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      success: true,
      data: { user, token },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to register user',
    });
  }
});

// Login (simplified - add password field to schema for full implementation)
authRouter.post('/login', [
  body('email').isEmail().normalizeEmail(),
  body('password').notEmpty(),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: errors.array(),
      });
    }

    const { email } = req.body;

    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
      },
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials',
      });
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      data: { user, token },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to login',
    });
  }
});
```

Create `apps/api/src/routes/campaigns.ts`:

```typescript
import { Router } from 'express';
import { body, query, validationResult } from 'express-validator';

import { prisma } from '@sendstuff/database';
import { createCampaignSchema, paginationSchema } from '@sendstuff/shared';

import { authenticate } from '../middleware/auth';

export const campaignsRouter = Router();

// Apply authentication to all campaign routes
campaignsRouter.use(authenticate);

// Get all campaigns with pagination
campaignsRouter.get('/', [
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
  query('status').optional().isIn(['DRAFT', 'SCHEDULED', 'SENDING', 'SENT', 'CANCELLED']),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: errors.array(),
      });
    }

    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const status = req.query.status as string;
    const skip = (page - 1) * limit;

    const where = {
      userId: req.user!.id,
      ...(status && { status }),
    };

    const [campaigns, total] = await Promise.all([
      prisma.campaign.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          _count: {
            select: { campaignLogs: true },
          },
        },
      }),
      prisma.campaign.count({ where }),
    ]);

    const pages = Math.ceil(total / limit);

    res.json({
      success: true,
      data: campaigns,
      pagination: {
        page,
        limit,
        total,
        pages,
        hasNext: page < pages,
        hasPrev: page > 1,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch campaigns',
    });
  }
});

// Create campaign
campaignsRouter.post('/', [
  body('title').notEmpty().trim(),
  body('subject').notEmpty().trim(),
  body('content').notEmpty(),
  body('htmlContent').optional(),
  body('scheduledAt').optional().isISO8601(),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: errors.array(),
      });
    }

    const { title, subject, content, htmlContent, scheduledAt } = req.body;

    const campaign = await prisma.campaign.create({
      data: {
        title,
        subject,
        content,
        htmlContent,
        scheduledAt: scheduledAt ? new Date(scheduledAt) : null,
        userId: req.user!.id,
      },
    });

    res.status(201).json({
      success: true,
      data: campaign,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to create campaign',
    });
  }
});

// Get campaign by ID
campaignsRouter.get('/:id', async (req, res) => {
  try {
    const campaign = await prisma.campaign.findFirst({
      where: {
        id: req.params.id,
        userId: req.user!.id,
      },
      include: {
        _count: {
          select: { campaignLogs: true },
        },
        campaignLogs: {
          include: {
            subscriber: {
              select: {
                id: true,
                email: true,
                name: true,
              },
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
          take: 10, // Latest 10 logs
        },
      },
    });

    if (!campaign) {
      return res.status(404).json({
        success: false,
        error: 'Campaign not found',
      });
    }

    res.json({
      success: true,
      data: campaign,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch campaign',
    });
  }
});

// Update campaign
campaignsRouter.put('/:id', [
  body('title').optional().notEmpty().trim(),
  body('subject').optional().notEmpty().trim(),
  body('content').optional().notEmpty(),
  body('htmlContent').optional(),
  body('scheduledAt').optional().isISO8601(),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: errors.array(),
      });
    }

    const { title, subject, content, htmlContent, scheduledAt } = req.body;

    const campaign = await prisma.campaign.updateMany({
      where: {
        id: req.params.id,
        userId: req.user!.id,
        status: 'DRAFT', // Only allow editing draft campaigns
      },
      data: {
        ...(title && { title }),
        ...(subject && { subject }),
        ...(content && { content }),
        ...(htmlContent !== undefined && { htmlContent }),
        ...(scheduledAt && { scheduledAt: new Date(scheduledAt) }),
      },
    });

    if (campaign.count === 0) {
      return res.status(404).json({
        success: false,
        error: 'Campaign not found or cannot be edited',
      });
    }

    const updatedCampaign = await prisma.campaign.findUnique({
      where: { id: req.params.id },
    });

    res.json({
      success: true,
      data: updatedCampaign,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to update campaign',
    });
  }
});

// Delete campaign
campaignsRouter.delete('/:id', async (req, res) => {
  try {
    const campaign = await prisma.campaign.deleteMany({
      where: {
        id: req.params.id,
        userId: req.user!.id,
        status: 'DRAFT', // Only allow deleting draft campaigns
      },
    });

    if (campaign.count === 0) {
      return res.status(404).json({
        success: false,
        error: 'Campaign not found or cannot be deleted',
      });
    }

    res.json({
      success: true,
      message: 'Campaign deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to delete campaign',
    });
  }
});

// Send campaign
campaignsRouter.post('/:id/send', async (req, res) => {
  try {
    const campaign = await prisma.campaign.findFirst({
      where: {
        id: req.params.id,
        userId: req.user!.id,
        status: 'DRAFT',
      },
    });

    if (!campaign) {
      return res.status(404).json({
        success: false,
        error: 'Campaign not found or cannot be sent',
      });
    }

    // Update campaign status to SENDING
    await prisma.campaign.update({
      where: { id: campaign.id },
      data: { status: 'SENDING' },
    });

    // TODO: Queue campaign for sending (implement with Bull queue)
    // await campaignQueue.add('send-campaign', { campaignId: campaign.id });

    res.json({
      success: true,
      message: 'Campaign queued for sending',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to send campaign',
    });
  }
});
```

Create `apps/api/src/routes/subscribers.ts`:

```typescript
import { Router } from 'express';
import { body, query, validationResult } from 'express-validator';

import { prisma } from '@sendstuff/database';

import { authenticate } from '../middleware/auth';

export const subscribersRouter = Router();

// Apply authentication to all subscriber routes
subscribersRouter.use(authenticate);

// Get all subscribers with pagination and filtering
subscribersRouter.get('/', [
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
  query('status').optional().isIn(['ACTIVE', 'UNSUBSCRIBED', 'BOUNCED']),
  query('search').optional().trim(),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: errors.array(),
      });
    }

    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const status = req.query.status as string;
    const search = req.query.search as string;
    const skip = (page - 1) * limit;

    const where = {
      userId: req.user!.id,
      ...(status && { status }),
      ...(search && {
        OR: [
          { email: { contains: search, mode: 'insensitive' as const } },
          { name: { contains: search, mode: 'insensitive' as const } },
        ],
      }),
    };

    const [subscribers, total] = await Promise.all([
      prisma.subscriber.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.subscriber.count({ where }),
    ]);

    const pages = Math.ceil(total / limit);

    res.json({
      success: true,
      data: subscribers,
      pagination: {
        page,
        limit,
        total,
        pages,
        hasNext: page < pages,
        hasPrev: page > 1,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch subscribers',
    });
  }
});

// Create subscriber
subscribersRouter.post('/', [
  body('email').isEmail().normalizeEmail(),
  body('name').optional().trim().escape(),
  body('tags').optional().isArray(),
  body('metadata').optional().isObject(),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: errors.array(),
      });
    }

    const { email, name, tags, metadata } = req.body;

    // Check if subscriber already exists
    const existing = await prisma.subscriber.findUnique({
      where: {
        email_userId: {
          email,
          userId: req.user!.id,
        },
      },
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        error: 'Subscriber already exists',
      });
    }

    const subscriber = await prisma.subscriber.create({
      data: {
        email,
        name,
        tags: tags || [],
        metadata: metadata || {},
        userId: req.user!.id,
      },
    });

    res.status(201).json({
      success: true,
      data: subscriber,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to create subscriber',
    });
  }
});

// Bulk import subscribers
subscribersRouter.post('/import', [
  body('subscribers').isArray({ min: 1 }),
  body('subscribers.*.email').isEmail(),
  body('subscribers.*.name').optional().trim(),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: errors.array(),
      });
    }

    const { subscribers: importData } = req.body;
    const userId = req.user!.id;

    // Get existing emails to avoid duplicates
    const existingEmails = await prisma.subscriber.findMany({
      where: {
        userId,
        email: { in: importData.map((s: any) => s.email) },
      },
      select: { email: true },
    });

    const existingEmailSet = new Set(existingEmails.map(s => s.email));

    // Filter out duplicates
    const newSubscribers = importData.filter((s: any) => 
      !existingEmailSet.has(s.email)
    );

    if (newSubscribers.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'All subscribers already exist',
      });
    }

    // Bulk create
    const created = await prisma.subscriber.createMany({
      data: newSubscribers.map((s: any) => ({
        ...s,
        userId,
        tags: s.tags || [],
        metadata: s.metadata || {},
      })),
    });

    res.status(201).json({
      success: true,
      data: {
        created: created.count,
        skipped: importData.length - created.count,
        total: importData.length,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to import subscribers',
    });
  }
});

// Get subscriber by ID
subscribersRouter.get('/:id', async (req, res) => {
  try {
    const subscriber = await prisma.subscriber.findFirst({
      where: {
        id: req.params.id,
        userId: req.user!.id,
      },
      include: {
        campaignLogs: {
          include: {
            campaign: {
              select: {
                id: true,
                title: true,
                subject: true,
              },
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
    });

    if (!subscriber) {
      return res.status(404).json({
        success: false,
        error: 'Subscriber not found',
      });
    }

    res.json({
      success: true,
      data: subscriber,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch subscriber',
    });
  }
});

// Update subscriber
subscribersRouter.put('/:id', [
  body('name').optional().trim().escape(),
  body('status').optional().isIn(['ACTIVE', 'UNSUBSCRIBED', 'BOUNCED']),
  body('tags').optional().isArray(),
  body('metadata').optional().isObject(),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: errors.array(),
      });
    }

    const { name, status, tags, metadata } = req.body;

    const subscriber = await prisma.subscriber.updateMany({
      where: {
        id: req.params.id,
        userId: req.user!.id,
      },
      data: {
        ...(name !== undefined && { name }),
        ...(status && { status }),
        ...(tags && { tags }),
        ...(metadata && { metadata }),
      },
    });

    if (subscriber.count === 0) {
      return res.status(404).json({
        success: false,
        error: 'Subscriber not found',
      });
    }

    const updatedSubscriber = await prisma.subscriber.findUnique({
      where: { id: req.params.id },
    });

    res.json({
      success: true,
      data: updatedSubscriber,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to update subscriber',
    });
  }
});

// Delete subscriber
subscribersRouter.delete('/:id', async (req, res) => {
  try {
    const subscriber = await prisma.subscriber.deleteMany({
      where: {
        id: req.params.id,
        userId: req.user!.id,
      },
    });

    if (subscriber.count === 0) {
      return res.status(404).json({
        success: false,
        error: 'Subscriber not found',
      });
    }

    res.json({
      success: true,
      message: 'Subscriber deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to delete subscriber',
    });
  }
});
```

Create `apps/api/src/routes/users.ts`:

```typescript
import { Router } from 'express';

import { prisma } from '@sendstuff/database';

import { authenticate, authorize } from '../middleware/auth';

export const usersRouter = Router();

// Apply authentication to all user routes
usersRouter.use(authenticate);

// Get current user profile
usersRouter.get('/me', async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.id },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
        _count: {
          select: {
            campaigns: true,
            subscribers: true,
          },
        },
      },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found',
      });
    }

    res.json({
      success: true,
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch user profile',
    });
  }
});

// Get dashboard stats
usersRouter.get('/stats', async (req, res) => {
  try {
    const userId = req.user!.id;

    const [
      totalSubscribers,
      totalCampaigns,
      sentCampaigns,
      deliveredLogs,
      openedLogs,
      clickedLogs,
      bouncedLogs,
    ] = await Promise.all([
      prisma.subscriber.count({
        where: { userId, status: 'ACTIVE' },
      }),
      prisma.campaign.count({
        where: { userId },
      }),
      prisma.campaign.count({
        where: { userId, status: 'SENT' },
      }),
      prisma.campaignLog.count({
        where: { 
          campaign: { userId },
          event: 'DELIVERED',
        },
      }),
      prisma.campaignLog.count({
        where: { 
          campaign: { userId },
          event: 'OPENED',
        },
      }),
      prisma.campaignLog.count({
        where: { 
          campaign: { userId },
          event: 'CLICKED',
        },
      }),
      prisma.campaignLog.count({
        where: { 
          campaign: { userId },
          event: 'BOUNCED',
        },
      }),
    ]);

    // Calculate rates
    const totalSent = deliveredLogs + bouncedLogs;
    const deliveryRate = totalSent > 0 ? ((deliveredLogs / totalSent) * 100) : 0;
    const openRate = deliveredLogs > 0 ? ((openedLogs / deliveredLogs) * 100) : 0;
    const clickRate = deliveredLogs > 0 ? ((clickedLogs / deliveredLogs) * 100) : 0;

    // Get recent activity
    const recentCampaigns = await prisma.campaign.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 5,
      select: {
        id: true,
        title: true,
        status: true,
        createdAt: true,
        sentAt: true,
      },
    });

    const recentActivity = recentCampaigns.map(campaign => ({
      id: campaign.id,
      type: campaign.status === 'SENT' ? 'campaign_sent' : 'campaign_created',
      message: campaign.status === 'SENT' 
        ? `Campaign "${campaign.title}" was sent`
        : `Campaign "${campaign.title}" was created`,
      timestamp: campaign.sentAt || campaign.createdAt,
    }));

    res.json({
      success: true,
      data: {
        totalSubscribers,
        totalCampaigns,
        deliveryRate: Math.round(deliveryRate * 100) / 100,
        openRate: Math.round(openRate * 100) / 100,
        clickRate: Math.round(clickRate * 100) / 100,
        recentActivity,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch dashboard stats',
    });
  }
});

// Admin-only: Get all users
usersRouter.get('/', authorize(['ADMIN']), async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
        _count: {
          select: {
            campaigns: true,
            subscribers: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json({
      success: true,
      data: users,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch users',
    });
  }
});
```

### 5.3 TypeScript Configuration

Create `apps/api/tsconfig.json`:

```json
{
  "extends": "@sendstuff/typescript-config/node.json",
  "compilerOptions": {
    "outDir": "dist",
    "rootDir": "src"
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

### 5.4 Environment Configuration

Create `apps/api/.env.example`:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/sendstuff?schema=public"

# JWT
JWT_SECRET="your-super-secret-jwt-key-here-make-it-long-and-secure"

# Email
EMAIL_PROVIDER="resend"
EMAIL_API_KEY="your-email-api-key"
EMAIL_FROM="hello@yourdomain.com"

# App URLs
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NEXT_PUBLIC_API_URL="http://localhost:5000"

# Server
PORT=5000
NODE_ENV="development"

# Redis (optional, for queues)
REDIS_URL="redis://localhost:6379"
```

## 🌐 Step 6: Frontend Application Setup

### 6.1 Initialize Next.js Application

```bash
cd ../../apps
npx create-next-app@latest web --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"
cd web
```

### 6.2 Update Frontend Configuration

Update `apps/web/package.json`:

```json
{
  "name": "@sendstuff/web",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "type-check": "tsc --noEmit"
  },
  "dependencies": {
    "@sendstuff/shared": "workspace:*",
    "@sendstuff/ui": "workspace:*",
    "next": "14.0.4",
    "react": "^18",
    "react-dom": "^18",
    "@headlessui/react": "^1.7.17",
    "@heroicons/react": "^2.0.18",
    "clsx": "^2.0.0",
    "date-fns": "^3.0.0",
    "react-hook-form": "^7.48.2",
    "zod": "^3.22.0",
    "@hookform/resolvers": "^3.3.2",
    "axios": "^1.6.0",
    "react-query": "^3.39.3",
    "react-hot-toast": "^2.4.1",
    "recharts": "^2.8.0"
  },
  "devDependencies": {
    "@sendstuff/typescript-config": "workspace:*",
    "@sendstuff/eslint-config": "workspace:*",
    "@sendstuff/tailwind-config": "workspace:*",
    "typescript": "^5",
    "@types/node": "^20",
    "@types/react": "^18",
    "@types/react-dom": "^18",
    "autoprefixer": "^10.0.1",
    "postcss": "^8",
    "tailwindcss": "^3.3.0",
    "eslint": "^8",
    "eslint-config-next": "14.0.4"
  }
}
```

Update `apps/web/tsconfig.json`:

```json
{
  "extends": "@sendstuff/typescript-config/nextjs.json",
  "compilerOptions": {
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": ["./src/*"],
      "@sendstuff/shared": ["../../packages/shared/src/index.ts"],
      "@sendstuff/ui": ["../../packages/ui/src/index.ts"]
    }
  },
  "include": [
    "next-env.d.ts",
    "**/*.ts",
    "**/*.tsx",
    ".next/types/**/*.ts"
  ],
  "exclude": ["node_modules"]
}
```

Update `apps/web/tailwind.config.ts`:

```typescript
import type { Config } from 'tailwindcss';

const config: Config = {
  ...require('@sendstuff/tailwind-config'),
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    '../../packages/ui/src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
};

export default config;
```

Create `apps/web/.eslintrc.js`:

```javascript
module.exports = {
  extends: ['@sendstuff/eslint-config/nextjs'],
};
```

## 🎨 Step 7: UI Components Package

### 7.1 Initialize UI Package

```bash
mkdir -p packages/ui/src/components
cd packages/ui
pnpm init
```

Create `packages/ui/package.json`:

```json
{
  "name": "@sendstuff/ui",
  "version": "1.0.0",
  "private": true,
  "main": "src/index.ts",
  "types": "src/index.ts",
  "scripts": {    "type-check": "tsc --noEmit",
    "lint": "eslint src --ext .ts,.tsx"
  },
  "dependencies": {
    "@headlessui/react": "^1.7.17",
    "@heroicons/react": "^2.0.18",
    "clsx": "^2.0.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  },
  "devDependencies": {
    "@sendstuff/typescript-config": "workspace:*",
    "@sendstuff/eslint-config": "workspace:*",
    "@types/react": "^18.2.0",
    "@types/react-dom": "^18.2.0",
    "typescript": "^5.3.0"
  },
  "peerDependencies": {
    "react": "^18.0.0",
    "react-dom": "^18.0.0"
  }
}
```

Create `packages/ui/src/index.ts`:

```typescript
// Components
export * from './components/Button';
export * from './components/Input';
export * from './components/Card';
export * from './components/Modal';
export * from './components/Table';
export * from './components/Badge';
export * from './components/Loading';

// Utils
export * from './utils/cn';
```

Create `packages/ui/src/utils/cn.ts`:

```typescript
import { clsx, type ClassValue } from 'clsx';

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}
```

Create `packages/ui/src/components/Button.tsx`:

```typescript
import React from 'react';

import { cn } from '../utils/cn';

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', isLoading, children, disabled, ...props }, ref) => {
    return (
      <button
        className={cn(
          // Base styles
          'inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50',
          // Variants
          {
            'bg-primary-600 text-white hover:bg-primary-700': variant === 'primary',
            'bg-secondary-100 text-secondary-900 hover:bg-secondary-200': variant === 'secondary',
            'border border-input bg-transparent hover:bg-accent': variant === 'outline',
            'hover:bg-accent': variant === 'ghost',
            'bg-red-600 text-white hover:bg-red-700': variant === 'danger',
          },
          // Sizes
          {
            'h-8 px-3 text-sm': size === 'sm',
            'h-10 px-4': size === 'md',
            'h-12 px-8 text-lg': size === 'lg',
          },
          className
        )}
        ref={ref}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading && (
          <svg
            className="mr-2 h-4 w-4 animate-spin"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
```

Create `packages/ui/src/components/Input.tsx`:

```typescript
import React from 'react';

import { cn } from '../utils/cn';

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  description?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, description, id, ...props }, ref) => {
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;

    return (
      <div className="space-y-1">
        {label && (
          <label htmlFor={inputId} className="block text-sm font-medium text-gray-700">
            {label}
          </label>
        )}
        <input
          id={inputId}
          className={cn(
            'block w-full rounded-md border-0 py-2 px-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6',
            error && 'ring-red-500 focus:ring-red-600',
            className
          )}
          ref={ref}
          {...props}
        />
        {description && !error && (
          <p className="text-sm text-gray-500">{description}</p>
        )}
        {error && (
          <p className="text-sm text-red-600">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
```

Create `packages/ui/src/components/Card.tsx`:

```typescript
import React from 'react';

import { cn } from '../utils/cn';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'rounded-lg border bg-card text-card-foreground shadow-sm',
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';

export const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex flex-col space-y-1.5 p-6', className)}
    {...props}
  />
));

CardHeader.displayName = 'CardHeader';

export const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn('text-lg font-semibold leading-none tracking-tight', className)}
    {...props}
  />
));

CardTitle.displayName = 'CardTitle';

export const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn('text-sm text-muted-foreground', className)}
    {...props}
  />
));

CardDescription.displayName = 'CardDescription';

export const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('p-6 pt-0', className)} {...props} />
));

CardContent.displayName = 'CardContent';

export const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex items-center p-6 pt-0', className)}
    {...props}
  />
));

CardFooter.displayName = 'CardFooter';
```

Create `packages/ui/src/components/Badge.tsx`:

```typescript
import React from 'react';

import { cn } from '../utils/cn';

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info';
}

export const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, variant = 'default', ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
          {
            'bg-gray-100 text-gray-800': variant === 'default',
            'bg-green-100 text-green-800': variant === 'success',
            'bg-yellow-100 text-yellow-800': variant === 'warning',
            'bg-red-100 text-red-800': variant === 'danger',
            'bg-blue-100 text-blue-800': variant === 'info',
          },
          className
        )}
        {...props}
      />
    );
  }
);

Badge.displayName = 'Badge';
```

Create `packages/ui/src/components/Loading.tsx`:

```typescript
import React from 'react';

import { cn } from '../utils/cn';

export interface LoadingProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const Loading: React.FC<LoadingProps> = ({ 
  size = 'md', 
  className 
}) => {
  return (
    <div
      className={cn(
        'animate-spin rounded-full border-2 border-gray-300 border-t-primary-600',
        {
          'h-4 w-4': size === 'sm',
          'h-6 w-6': size === 'md',
          'h-8 w-8': size === 'lg',
        },
        className
      )}
    />
  );
};

export const LoadingScreen: React.FC = () => {
  return (
    <div className="flex h-64 items-center justify-center">
      <div className="text-center">
        <Loading size="lg" />
        <p className="mt-4 text-gray-600">Loading...</p>
      </div>
    </div>
  );
};
```

## 🚀 Step 8: Worker Application Setup

### 8.1 Initialize Worker Application

```bash
mkdir -p apps/worker/src
cd apps/worker
pnpm init
```

Create `apps/worker/package.json`:

```json
{
  "name": "@sendstuff/worker",
  "version": "1.0.0",
  "private": true,
  "main": "src/index.ts",
  "scripts": {
    "dev": "tsx watch src/index.ts",
    "build": "tsc",
    "start": "node dist/index.js",
    "type-check": "tsc --noEmit"
  },
  "dependencies": {
    "@sendstuff/config": "workspace:*",
    "@sendstuff/database": "workspace:*",
    "@sendstuff/shared": "workspace:*",
    "@sendstuff/email": "workspace:*",
    "bull": "^4.12.0",
    "redis": "^4.6.0",
    "dotenv": "^16.3.0",
    "winston": "^3.11.0"
  },
  "devDependencies": {
    "@sendstuff/typescript-config": "workspace:*",
    "@types/bull": "^4.10.0",
    "tsx": "^4.0.0",
    "typescript": "^5.3.0"
  }
}
```

Create `apps/worker/src/index.ts`:

```typescript
import dotenv from 'dotenv';

// Load environment variables first
dotenv.config();

import Bull from 'bull';

import { env } from '@sendstuff/config';
import { logger } from './utils/logger';
import { processCampaign } from './processors/campaign-processor';

// Initialize Redis connection for Bull
const redis = {
  host: env.REDIS_URL ? new URL(env.REDIS_URL).hostname : 'localhost',
  port: env.REDIS_URL ? parseInt(new URL(env.REDIS_URL).port) : 6379,
  password: env.REDIS_URL ? new URL(env.REDIS_URL).password : undefined,
};

// Create job queues
export const campaignQueue = new Bull('campaign processing', { redis });
export const emailQueue = new Bull('email sending', { redis });

// Process campaign jobs
campaignQueue.process('send-campaign', 5, processCampaign);

// Queue event handlers
campaignQueue.on('completed', (job) => {
  logger.info(`Campaign job completed: ${job.id}`);
});

campaignQueue.on('failed', (job, err) => {
  logger.error(`Campaign job failed: ${job.id}`, err);
});

campaignQueue.on('stalled', (job) => {
  logger.warn(`Campaign job stalled: ${job.id}`);
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  logger.info('SIGTERM received, closing queues...');
  await campaignQueue.close();
  await emailQueue.close();
  process.exit(0);
});

logger.info('🔄 SendStuff Worker started');
logger.info(`📊 Environment: ${env.NODE_ENV}`);
```

Create `apps/worker/src/utils/logger.ts`:

```typescript
import winston from 'winston';

import { env } from '@sendstuff/config';

const logFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.json()
);

export const logger = winston.createLogger({
  level: env.NODE_ENV === 'production' ? 'info' : 'debug',
  format: logFormat,
  defaultMeta: { service: 'sendstuff-worker' },
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      ),
    }),
    new winston.transports.File({ 
      filename: 'logs/worker-error.log', 
      level: 'error' 
    }),
    new winston.transports.File({ 
      filename: 'logs/worker.log' 
    }),
  ],
});
```

Create `apps/worker/src/processors/campaign-processor.ts`:

```typescript
import type { Job } from 'bull';
import { render } from '@react-email/render';

import { prisma } from '@sendstuff/database';
import { createEmailService } from '@sendstuff/email';
import { CampaignEmail } from '@sendstuff/email';

import { logger } from '../utils/logger';

interface CampaignJobData {
  campaignId: string;
}

export async function processCampaign(job: Job<CampaignJobData>) {
  const { campaignId } = job.data;
  
  logger.info(`Processing campaign: ${campaignId}`);

  try {
    // Get campaign with subscribers
    const campaign = await prisma.campaign.findUnique({
      where: { id: campaignId },
      include: {
        user: {
          include: {
            subscribers: {
              where: { status: 'ACTIVE' },
            },
          },
        },
      },
    });

    if (!campaign) {
      throw new Error(`Campaign not found: ${campaignId}`);
    }

    if (campaign.status !== 'SENDING') {
      throw new Error(`Campaign is not in SENDING status: ${campaign.status}`);
    }

    const subscribers = campaign.user.subscribers;
    
    if (subscribers.length === 0) {
      logger.warn(`No active subscribers for campaign: ${campaignId}`);
      
      await prisma.campaign.update({
        where: { id: campaignId },
        data: { 
          status: 'SENT',
          sentAt: new Date(),
        },
      });
      
      return;
    }

    // Initialize email service
    const emailService = createEmailService();

    // Send emails in batches
    const batchSize = 100;
    const batches = [];
    
    for (let i = 0; i < subscribers.length; i += batchSize) {
      batches.push(subscribers.slice(i, i + batchSize));
    }

    let totalSent = 0;
    let totalErrors = 0;

    for (const [batchIndex, batch] of batches.entries()) {
      logger.info(`Processing batch ${batchIndex + 1}/${batches.length} for campaign ${campaignId}`);
      
      // Update job progress
      const progress = Math.round(((batchIndex + 1) / batches.length) * 100);
      await job.progress(progress);

      const emailPromises = batch.map(async (subscriber) => {
        try {
          // Render email content
          const emailHtml = campaign.htmlContent || 
            render(CampaignEmail({ 
              subject: campaign.subject,
              content: campaign.content,
            }));

          // Send email
          const result = await emailService.send({
            to: subscriber.email,
            subject: campaign.subject,
            html: emailHtml,
          });

          // Log the result
          await prisma.campaignLog.create({
            data: {
              campaignId: campaign.id,
              subscriberId: subscriber.id,
              event: result.success ? 'SENT' : 'BOUNCED',
              metadata: {
                messageId: result.messageId,
                error: result.error,
              },
            },
          });

          if (result.success) {
            totalSent++;
          } else {
            totalErrors++;
            logger.error(`Failed to send email to ${subscriber.email}: ${result.error}`);
          }

          return result;
        } catch (error) {
          totalErrors++;
          logger.error(`Error sending email to ${subscriber.email}:`, error);
          
          // Log the error
          await prisma.campaignLog.create({
            data: {
              campaignId: campaign.id,
              subscriberId: subscriber.id,
              event: 'BOUNCED',
              metadata: {
                error: error instanceof Error ? error.message : 'Unknown error',
              },
            },
          });

          return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
        }
      });

      // Wait for batch to complete
      await Promise.allSettled(emailPromises);
      
      // Add delay between batches to respect rate limits
      if (batchIndex < batches.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    // Update campaign status
    await prisma.campaign.update({
      where: { id: campaignId },
      data: { 
        status: 'SENT',
        sentAt: new Date(),
      },
    });

    logger.info(`Campaign ${campaignId} completed. Sent: ${totalSent}, Errors: ${totalErrors}`);

    return {
      campaignId,
      totalSubscribers: subscribers.length,
      totalSent,
      totalErrors,
    };

  } catch (error) {
    logger.error(`Error processing campaign ${campaignId}:`, error);
    
    // Update campaign status to failed
    await prisma.campaign.update({
      where: { id: campaignId },
      data: { status: 'DRAFT' }, // Reset to draft so it can be retried
    });

    throw error;
  }
}
```

Create `apps/worker/tsconfig.json`:

```json
{
  "extends": "@sendstuff/typescript-config/node.json",
  "compilerOptions": {
    "outDir": "dist",
    "rootDir": "src"
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

## 🏁 Step 9: Project Finalization

### 9.1 Root Package.json Scripts

Update the root `package.json` with comprehensive scripts:

```json
{
  "name": "sendstuff",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "build": "turbo run build",
    "dev": "turbo run dev",
    "dev:web": "turbo run dev --filter=@sendstuff/web",
    "dev:api": "turbo run dev --filter=@sendstuff/api",
    "dev:worker": "turbo run dev --filter=@sendstuff/worker",
    "lint": "turbo run lint",
    "type-check": "turbo run type-check",
    "clean": "turbo run clean",
    "test": "turbo run test",
    "db:generate": "turbo run db:generate --filter=@sendstuff/database",
    "db:push": "turbo run db:push --filter=@sendstuff/database",
    "db:migrate": "turbo run db:migrate --filter=@sendstuff/database",
    "db:seed": "turbo run db:seed --filter=@sendstuff/database",
    "db:studio": "turbo run db:studio --filter=@sendstuff/database",
    "db:reset": "turbo run db:reset --filter=@sendstuff/database",
    "setup": "pnpm install && pnpm db:generate && pnpm build"
  },
  "devDependencies": {
    "turbo": "^1.10.0",
    "typescript": "^5.3.0",
    "@types/node": "^20.0.0",
    "prettier": "^3.0.0",
    "eslint": "^8.0.0"
  },
  "packageManager": "pnpm@8.10.0"
}
```

### 9.2 Environment Files

Create `.env.example` at root:

```env
# Copy this file to .env and fill in your values

# Database
DATABASE_URL="postgresql://username:password@localhost:5432/sendstuff?schema=public"

# JWT Secret (generate with: openssl rand -base64 32)
JWT_SECRET="your-super-secret-jwt-key-here-make-it-long-and-secure"

# Email Configuration
EMAIL_PROVIDER="resend"
EMAIL_API_KEY="your-email-api-key"
EMAIL_FROM="hello@yourdomain.com"

# App URLs
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NEXT_PUBLIC_API_URL="http://localhost:5000"

# Server Ports
PORT=5000
WEB_PORT=3000

# Environment
NODE_ENV="development"

# Redis (for background jobs)
REDIS_URL="redis://localhost:6379"
```

### 9.3 Docker Configuration

Create `docker/docker-compose.yml`:

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:15-alpine
    container_name: sendstuff-postgres
    environment:
      POSTGRES_DB: sendstuff
      POSTGRES_USER: sendstuff
      POSTGRES_PASSWORD: sendstuff
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
    networks:
      - sendstuff

  redis:
    image: redis:7-alpine
    container_name: sendstuff-redis
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
    networks:
      - sendstuff

  # Optional: Redis Commander (Redis GUI)
  redis-commander:
    image: rediscommander/redis-commander:latest
    container_name: sendstuff-redis-commander
    environment:
      REDIS_HOSTS: local:redis:6379
    ports:
      - "8081:8081"
    depends_on:
      - redis
    networks:
      - sendstuff

volumes:
  postgres_data:
  redis_data:

networks:
  sendstuff:
    driver: bridge
```

### 9.4 Git Configuration

Create `.gitignore`:

```gitignore
# Dependencies
node_modules/
.pnp
.pnp.js

# Testing
coverage/
*.lcov

# Next.js
.next/
out/

# Production builds
build/
dist/

# Environment variables
.env
.env*.local

# Logs
logs/
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*
lerna-debug.log*

# Runtime data
pids/
*.pid
*.seed
*.pid.lock

# Database
*.db
*.sqlite

# IDE
.vscode/
.idea/
*.swp
*.swo

# OS
.DS_Store
Thumbs.db

# Temporary folders
tmp/
temp/

# Build info
.tsbuildinfo

# Turbo
.turbo/

# Prisma
prisma/migrations/dev.db*

# Docker
.docker/
```

## 🚀 Step 10: Getting Started

### 10.1 Initial Setup

```bash
# 1. Clone or initialize the project
git clone <your-repo> sendstuff
cd sendstuff

# 2. Install dependencies
pnpm install

# 3. Start services (PostgreSQL and Redis)
cd docker && docker-compose up -d

# 4. Set up environment variables
cp .env.example .env
# Edit .env with your configuration

# 5. Generate Prisma client and run migrations
pnpm db:generate
pnpm db:migrate

# 6. Seed the database (optional)
pnpm db:seed

# 7. Build all packages
pnpm build
```

### 10.2 Development

```bash
# Start all services in development mode
pnpm dev

# Or start individual services:
pnpm dev:web      # Next.js frontend (http://localhost:3000)
pnpm dev:api      # Express.js API (http://localhost:5000)
pnpm dev:worker   # Background worker
```

### 10.3 Production Deployment

```bash
# Build for production
pnpm build

# Start production services
pnpm start:web
pnpm start:api
pnpm start:worker
```

## 📋 Next Steps & Features to Implement

### Core Features
- [ ] User authentication & authorization
- [ ] Campaign management (CRUD)
- [ ] Subscriber management with segmentation
- [ ] Email template builder with drag-and-drop
- [ ] Scheduled campaign sending
- [ ] Email analytics & reporting
- [ ] Webhook integrations

### Advanced Features
- [ ] A/B testing for campaigns
- [ ] Automated email sequences
- [ ] Subscriber import/export (CSV, integrations)
- [ ] Custom fields for subscribers
- [ ] Email deliverability monitoring
- [ ] Multi-tenant architecture
- [ ] API rate limiting & quotas
- [ ] Real-time dashboard with WebSockets

### Infrastructure
- [ ] Horizontal scaling with load balancers
- [ ] Database replication & backups
- [ ] CDN for static assets
- [ ] Monitoring & alerting (Prometheus/Grafana)
- [ ] CI/CD pipelines
- [ ] Container orchestration (Kubernetes)

## 🔧 Development Commands Reference

```bash
# Database
pnpm db:generate    # Generate Prisma client
pnpm db:migrate     # Run database migrations
pnpm db:seed        # Seed database with sample data
pnpm db:studio      # Open Prisma Studio
pnpm db:reset       # Reset database (destructive)

# Development
pnpm dev            # Start all services
pnpm dev:web        # Start frontend only
pnpm dev:api        # Start API only
pnpm dev:worker     # Start worker only

# Build & Type Checking
pnpm build          # Build all packages
pnpm type-check     # Type check all packages
pnpm lint           # Lint all packages

# Utilities
pnpm clean          # Clean build artifacts
pnpm setup          # Initial project setup
```

## 📊 Architecture Benefits

### Scalability
- **Horizontal scaling**: Each service can be scaled independently
- **Database optimization**: PostgreSQL with proper indexing and queries
- **Background processing**: Bull queues for reliable job processing
- **Caching**: Redis for session storage and job queues

### Developer Experience
- **Type safety**: End-to-end TypeScript with shared types
- **Hot reloading**: Fast development cycles
- **Monorepo benefits**: Code sharing and unified dependencies
- **Structured codebase**: Clean architecture with separation of concerns

### Maintainability
- **Modular design**: Packages can be updated independently
- **Shared configurations**: Consistent tooling across all apps
- **Comprehensive testing**: Unit, integration, and e2e test setup
- **Documentation**: Self-documenting code with TypeScript

This enterprise-grade setup provides a solid foundation for building a scalable newsletter platform that can grow with your needs while maintaining code quality and developer productivity.