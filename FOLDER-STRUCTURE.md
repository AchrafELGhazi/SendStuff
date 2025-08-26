SendStuff/
├── 📦 apps/
│   ├── 🌐 web/                          # Next.js frontend
│   │   ├── src/
│   │   │   ├── app/                     # App Router
│   │   │   │   ├── (auth)/              # Route groups
│   │   │   │   │   ├── login/
│   │   │   │   │   │   └── page.tsx
│   │   │   │   │   └── register/
│   │   │   │   │       └── page.tsx
│   │   │   │   ├── dashboard/
│   │   │   │   │   ├── campaigns/
│   │   │   │   │   │   └── page.tsx
│   │   │   │   │   ├── subscribers/
│   │   │   │   │   │   └── page.tsx
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── api/                 # API routes (optional - use server instead)
│   │   │   │   │   └── health/
│   │   │   │   │       └── route.ts
│   │   │   │   ├── globals.css
│   │   │   │   ├── layout.tsx
│   │   │   │   ├── loading.tsx
│   │   │   │   ├── not-found.tsx
│   │   │   │   └── page.tsx             # Your homepage
│   │   │   ├── components/              # Reusable components
│   │   │   │   ├── ui/                  # shadcn/ui components
│   │   │   │   │   ├── button.tsx
│   │   │   │   │   ├── card.tsx
│   │   │   │   │   ├── input.tsx
│   │   │   │   │   └── index.ts
│   │   │   │   ├── forms/               # Form components
│   │   │   │   │   ├── newsletter-form.tsx
│   │   │   │   │   └── subscriber-form.tsx
│   │   │   │   ├── charts/              # Chart components
│   │   │   │   │   ├── analytics-chart.tsx
│   │   │   │   │   └── performance-chart.tsx
│   │   │   │   ├── layout/              # Layout components
│   │   │   │   │   ├── header.tsx
│   │   │   │   │   ├── sidebar.tsx
│   │   │   │   │   ├── footer.tsx
│   │   │   │   │   └── navigation.tsx
│   │   │   │   └── features/            # Feature-specific components
│   │   │   │       ├── campaigns/
│   │   │   │       ├── subscribers/
│   │   │   │       └── analytics/
│   │   │   ├── lib/                     # Utility functions
│   │   │   │   ├── utils.ts             # General utilities
│   │   │   │   ├── api.ts               # API client setup
│   │   │   │   ├── auth.ts              # Authentication helpers
│   │   │   │   ├── validations.ts       # Zod schemas
│   │   │   │   └── constants.ts         # App constants
│   │   │   ├── hooks/                   # Custom React hooks
│   │   │   │   ├── use-api.ts
│   │   │   │   ├── use-auth.ts
│   │   │   │   └── use-local-storage.ts
│   │   │   ├── store/                   # State management
│   │   │   │   ├── auth-store.ts        # Zustand/Context stores
│   │   │   │   ├── campaign-store.ts
│   │   │   │   └── index.ts
│   │   │   ├── types/                   # TypeScript definitions
│   │   │   │   ├── api.ts               # API response types
│   │   │   │   ├── auth.ts              # Auth types
│   │   │   │   ├── campaign.ts          # Campaign types
│   │   │   │   └── index.ts
│   │   │   └── styles/                  # Additional styles
│   │   │       ├── components.css
│   │   │       └── utilities.css
│   │   ├── public/                      # Static assets
│   │   │   ├── icons/
│   │   │   ├── images/
│   │   │   ├── favicon.ico
│   │   │   └── logo.svg
│   │   ├── .env.local                   # Environment variables
│   │   ├── .env.example
│   │   ├── components.json              # shadcn/ui config
│   │   ├── next.config.js
│   │   ├── package.json
│   │   ├── tailwind.config.js
│   │   └── tsconfig.json
│   │
│   └── 🚀 server/                       # Express API
│       ├── src/
│       │   ├── controllers/             # Route handlers
│       │   │   ├── auth.controller.ts
│       │   │   ├── campaign.controller.ts
│       │   │   ├── subscriber.controller.ts
│       │   │   └── analytics.controller.ts
│       │   ├── middleware/              # Express middleware
│       │   │   ├── auth.middleware.ts
│       │   │   ├── cors.middleware.ts
│       │   │   ├── error.middleware.ts
│       │   │   └── validation.middleware.ts
│       │   ├── routes/                  # API routes
│       │   │   ├── auth.routes.ts
│       │   │   ├── campaigns.routes.ts
│       │   │   ├── subscribers.routes.ts
│       │   │   └── index.ts
│       │   ├── services/                # Business logic
│       │   │   ├── auth.service.ts
│       │   │   ├── email.service.ts
│       │   │   ├── campaign.service.ts
│       │   │   └── analytics.service.ts
│       │   ├── models/                  # Database models
│       │   │   ├── user.model.ts
│       │   │   ├── campaign.model.ts
│       │   │   ├── subscriber.model.ts
│       │   │   └── index.ts
│       │   ├── database/                # Database setup
│       │   │   ├── connection.ts
│       │   │   ├── migrations/
│       │   │   └── seeders/
│       │   ├── utils/                   # Server utilities
│       │   │   ├── logger.ts
│       │   │   ├── validator.ts
│       │   │   └── helpers.ts
│       │   ├── types/                   # Shared types
│       │   │   ├── express.d.ts
│       │   │   └── api.types.ts
│       │   ├── config/                  # Configuration
│       │   │   ├── database.config.ts
│       │   │   ├── email.config.ts
│       │   │   └── app.config.ts
│       │   └── app.ts                   # Express app setup
│       ├── .env                         # Server environment
│       ├── .env.example
│       ├── package.json
│       ├── tsconfig.json
│       └── nodemon.json
│
├── 📚 packages/                         # Shared packages
│   ├── @repo/ui/                        # Shared UI components
│   │   ├── src/
│   │   │   ├── components/
│   │   │   │   ├── button.tsx
│   │   │   │   ├── card.tsx
│   │   │   │   └── index.ts
│   │   │   └── styles/
│   │   │       └── globals.css
│   │   ├── package.json
│   │   ├── tailwind.config.js
│   │   └── tsconfig.json
│   │
│   ├── @repo/types/                     # Shared TypeScript types
│   │   ├── src/
│   │   │   ├── api.ts
│   │   │   ├── user.ts
│   │   │   ├── campaign.ts
│   │   │   └── index.ts
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   ├── @repo/utils/                     # Shared utilities
│   │   ├── src/
│   │   │   ├── validation.ts
│   │   │   ├── formatting.ts
│   │   │   ├── constants.ts
│   │   │   └── index.ts
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   ├── @repo/eslint-config/             # ESLint config
│   └── @repo/typescript-config/         # TypeScript config
│
├── 🔧 Configuration files
├── .env.example                         # Global environment template
├── .gitignore
├── package.json                         # Root package.json
├── pnpm-lock.yaml                       # Single lock file
├── pnpm-workspace.yaml                  # Workspace definition
├── turbo.json                           # Turborepo configuration
├── README.md
└── .vscode/
    └── settings.json                    # VS Code workspace settings