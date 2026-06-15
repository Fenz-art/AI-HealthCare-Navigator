export declare function findLocalEquivalents(activeIngredientName: string, countryCode: string): Promise<{
    id: string;
    brand: {
        id: string;
        countryId: string;
        name: string;
        activeIngredientId: string;
        otcStatus: string;
        doseRule: string;
    };
    activeIngredient: {
        id: string;
        name: string;
    };
    country: {
        code: string;
        id: string;
        name: string;
    };
    notes: string | null;
}[] & {
    legacy: ({
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
    })[];
    references: {
        id: string;
        country: string;
        sourceId: string;
        sourceType: string;
        brandName: string;
        ingredient: string;
        strength: string | null;
        otc: boolean | null;
        route: string | null;
        manufacturer: string | null;
        meta: string | null;
        importedAt: Date;
    }[];
}>;
export declare function findEquivalentsGlobally(ingredientName: string): Promise<{
    legacy: ({
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
    })[];
    references: {
        id: string;
        country: string;
        sourceId: string;
        sourceType: string;
        brandName: string;
        ingredient: string;
        strength: string | null;
        otc: boolean | null;
        route: string | null;
        manufacturer: string | null;
        meta: string | null;
        importedAt: Date;
    }[];
}>;
export declare function searchByBrandName(brandName: string): Promise<{
    legacy: ({
        country: {
            code: string;
            id: string;
            name: string;
        };
        activeIngredient: {
            id: string;
            name: string;
        };
    } & {
        id: string;
        countryId: string;
        name: string;
        activeIngredientId: string;
        otcStatus: string;
        doseRule: string;
    })[];
    references: {
        id: string;
        country: string;
        sourceId: string;
        sourceType: string;
        brandName: string;
        ingredient: string;
        strength: string | null;
        otc: boolean | null;
        route: string | null;
        manufacturer: string | null;
        meta: string | null;
        importedAt: Date;
    }[];
}>;
export declare function getCountriesWithData(): Promise<{
    legacy: {
        name: string;
        code: string;
        brandCount: number;
    }[];
    references: {
        country: string;
        count: number;
    }[];
}>;
