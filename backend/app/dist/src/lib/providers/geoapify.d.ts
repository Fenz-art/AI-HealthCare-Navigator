export type ProviderType = 'PHARMACY' | 'CLINIC' | 'HOSPITAL';
export declare function findNearbyProviders(lat: number, lng: number, type: ProviderType, radiusMeters?: number): Promise<any>;
