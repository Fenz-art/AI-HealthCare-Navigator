export type IngestionSourceType = 'OPENFDA' | 'DAILYMED' | 'EMA' | 'NHS';
export interface IngestionSourceConfig {
    name: string;
    sourceType: IngestionSourceType;
    country: string;
    baseUrl: string;
    active: boolean;
}
export declare const SOURCE_CONFIGS: Record<IngestionSourceType, IngestionSourceConfig>;
export interface IngestionResult {
    sourceType: IngestionSourceType;
    imported: number;
    failed: number;
    errors: string[];
}
