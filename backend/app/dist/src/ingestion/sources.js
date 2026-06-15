export const SOURCE_CONFIGS = {
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
//# sourceMappingURL=sources.js.map