
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