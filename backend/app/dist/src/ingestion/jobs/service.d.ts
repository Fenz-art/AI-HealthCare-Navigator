import { IngestionSourceType } from '../sources.js';
export declare function createJob(dataSourceId: string, sourceType: IngestionSourceType): Promise<string>;
export declare function updateJobProgress(jobId: string, data: {
    status?: 'QUEUED' | 'RUNNING' | 'FAILED' | 'COMPLETED';
    progress?: number;
}): Promise<void>;
export declare function completeJob(jobId: string, recordsImported: number, recordsFailed: number): Promise<void>;
export declare function failJob(jobId: string, error: string): Promise<void>;
export declare function getRecentJobs(limit?: number): Promise<({
    dataSource: {
        id: string;
        createdAt: Date;
        country: string | null;
        name: string;
        sourceType: string;
        lastSyncAt: Date | null;
        active: boolean;
    };
} & {
    error: string | null;
    status: import(".prisma/client").$Enums.IngestionJobStatus;
    id: string;
    createdAt: Date;
    sourceType: import(".prisma/client").$Enums.DataSourceType;
    progress: number;
    startedAt: Date | null;
    completedAt: Date | null;
    recordsImported: number;
    recordsFailed: number;
    dataSourceId: string;
})[]>;
export declare function getDataSourceStats(): Promise<{
    sources: ({
        jobs: {
            error: string | null;
            status: import(".prisma/client").$Enums.IngestionJobStatus;
            id: string;
            createdAt: Date;
            sourceType: import(".prisma/client").$Enums.DataSourceType;
            progress: number;
            startedAt: Date | null;
            completedAt: Date | null;
            recordsImported: number;
            recordsFailed: number;
            dataSourceId: string;
        }[];
    } & {
        id: string;
        createdAt: Date;
        country: string | null;
        name: string;
        sourceType: string;
        lastSyncAt: Date | null;
        active: boolean;
    })[];
    totalReferences: number;
    countriesCovered: string[];
    totalJobs: number;
    failedJobs: number;
}>;
export declare function ensureDataSources(): Promise<void>;
