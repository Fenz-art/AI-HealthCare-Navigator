export declare function findLocalEquivalents(activeIngredientName: string, countryCode: string): Promise<({
    country: {
        code: string;
        id: string;
        name: string;
    };
    activeIngredient: {
        id: string;
        name: string;
    };
    brand: {
        id: string;
        countryId: string;
        name: string;
        activeIngredientId: string;
        otcStatus: string;
        doseRule: string;
    };
} & {
    id: string;
    countryId: string;
    activeIngredientId: string;
    brandId: string;
    notes: string | null;
})[]>;
