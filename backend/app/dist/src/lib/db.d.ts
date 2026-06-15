import { PrismaClient } from '@prisma/client';
export declare const prisma: PrismaClient<{
    datasources: {
        db: {
            url: string | undefined;
        };
    };
    log: ("warn" | "error")[];
}, never, import("@prisma/client/runtime/library").DefaultArgs>;
