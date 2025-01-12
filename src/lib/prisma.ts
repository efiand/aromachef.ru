import type { PrismaClient as PrismaClientType } from '@prisma/client';

import { createRequire } from 'module';

type PrismaClientSingleton = ReturnType<typeof createClient>;
const globalForPrisma = globalThis as unknown as {
	prisma?: PrismaClientSingleton;
};

const require = createRequire(import.meta.url);
const { PrismaClient } = require('@prisma/client');

const prisma = globalForPrisma.prisma ?? createClient();

if (process.env.NODE_ENV !== 'production') {
	globalForPrisma.prisma = prisma;
}

function createClient() {
	return new (PrismaClient as typeof PrismaClientType)();
}

export { prisma };
