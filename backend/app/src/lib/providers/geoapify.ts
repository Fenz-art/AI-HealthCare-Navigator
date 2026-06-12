import { ProviderType } from '@prisma/client';

const GEOAPIFY_API_KEY = process.env.GEOAPIFY_API_KEY;
if (!GEOAPIFY_API_KEY) {
  throw new Error('GEOAPIFY_API_KEY is required to query provider locations.');
}

const CATEGORY_MAP: Record<ProviderType, string> = {
  PHARMACY: 'healthcare.pharmacy',
  CLINIC: 'healthcare.clinic',
  HOSPITAL: 'healthcare.hospital'
};

export async function findNearbyProviders(
  lat: number,
  lng: number,
  type: ProviderType,
  radiusMeters: number = 5000
) {
  const category = CATEGORY_MAP[type];
  const url = `https://api.geoapify.com/v2/places?categories=${category}&filter=circle:${lng},${lat},${radiusMeters}&bias=proximity:${lng},${lat}&limit=5&apiKey=${GEOAPIFY_API_KEY}`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Geoapify request failed: ${res.status} ${res.statusText}`);
  }

  const data = await res.json();
  return data.features.map((feature: any) => ({
    name: feature.properties.name || 'Unnamed Provider',
    address: feature.properties.formatted || '',
    lat: feature.properties.lat,
    lng: feature.properties.lon,
    externalId: feature.properties.place_id,
    type
  }));
}
