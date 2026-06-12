export declare function findLocalEquivalents(activeIngredientName: string, countryCode: string): Promise<({
    activeIngredient: {
        id: string;
        name: string;
    };
    country: {
        code: string;
        id: string;
        name: string;
    };
    brand: {
        id: string;
        activeIngredientId: string;
        countryId: string;
        name: string;
        otcStatus: import(".prisma/client").$Enums.OtcStatus;
        doseRule: import(".prisma/client").$Enums.DoseRule;
    };
} & {
    id: string;
    activeIngredientId: string;
    countryId: string;
    brandId: string;
    notes: string | null;
})[]>;
