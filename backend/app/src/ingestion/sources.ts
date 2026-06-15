export type IngestionSourceType = 'OPENFDA' | 'DAILYMED' | 'EMA' | 'NHS';

export interface IngestionSourceConfig {
  name: string;
  sourceType: IngestionSourceType;
  country: string;
  baseUrl: string;
  active: boolean;
}

export const SOURCE_CONFIGS: Record<IngestionSourceType, IngestionSourceConfig> = {
  OPENFDA: {
    name: 'OpenFDA',
    sourceType: 'OPENFDA',
    country: 'US',
    baseUrl: 'https://api.fda.gov/drug/label.json',
    active: true,
  },
  DAILYMED: {
    name: 'DailyMed',
    sourceType: 'DAILYMED',
    country: 'US',
    baseUrl: 'https://dailymed.nlm.nih.gov/dailymed/services/v2',
    active: true,
  },
  EMA: {
    name: 'European Medicines Agency',
    sourceType: 'EMA',
    country: 'EU',
    baseUrl: 'https://eu-post-authorisation.ema.europa.eu',
    active: false,
  },
  NHS: {
    name: 'NHS',
    sourceType: 'NHS',
    country: 'GB',
    baseUrl: 'https://api.nhs.uk/medicines',
    active: false,
  },
};

export interface IngestionResult {
  sourceType: IngestionSourceType;
  imported: number;
  failed: number;
  errors: string[];
}
