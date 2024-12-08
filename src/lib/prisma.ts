import { PrismaClient } from '@prisma/client';

type PrismaClientSingleton = ReturnType<typeof createClient>;

const globalForPrisma = globalThis as unknown as {
	prisma?: PrismaClientSingleton;
};

const prisma = globalForPrisma.prisma ?? createClient();

if (process.env.NODE_ENV !== 'production') {
	globalForPrisma.prisma = prisma;
}

function createClient() {
	return new PrismaClient();
}

export { prisma };
