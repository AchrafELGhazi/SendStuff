
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