import { PrismaClient } from '@prisma/client';
// Aurora serverless v2 can have cold-start latency — configure connection pool
// and enable query logging in development so we can see what's slow.
export const prisma = new PrismaClient({
    datasources: {
        db: {
            url: process.env.DATABASE_URL,
        },
    },
    log: process.env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error'],
});
// Graceful shutdown
process.on('beforeExit', async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=db.js.map