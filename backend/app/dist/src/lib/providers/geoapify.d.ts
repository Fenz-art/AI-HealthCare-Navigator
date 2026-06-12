import { ProviderType } from '@prisma/client';
export declare function findNearbyProviders(lat: number, lng: number, type: ProviderType, radiusMeters?: number): Promise<any>;
