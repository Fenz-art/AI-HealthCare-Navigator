import { HealthDocument, HealthPassport, TravelHealthSession } from '@prisma/client';
export declare function buildInterpreterContext(session: TravelHealthSession, healthPassport: HealthPassport | null, healthDocuments: HealthDocument[]): string;
