const GEOAPIFY_API_KEY = process.env.GEOAPIFY_API_KEY;
if (!GEOAPIFY_API_KEY) {
    console.warn('GEOAPIFY_API_KEY is not set — provider lookups will fail at runtime.');
}
const CATEGORY_MAP = {
    PHARMACY: 'healthcare.pharmacy',
    CLINIC: 'healthcare.clinic_or_praxis',
    HOSPITAL: 'healthcare.hospital'
};
export async function findNearbyProviders(lat, lng, type, radiusMeters = 5000) {
    if (!GEOAPIFY_API_KEY) {
        return [];
    }
    const category = CATEGORY_MAP[type];
    const url = `https://api.geoapify.com/v2/places` +
        `?categories=${category}` +
        `&filter=circle:${lng},${lat},${radiusMeters}` +
        `&bias=proximity:${lng},${lat}` +
        `&limit=5` +
        `&apiKey=${GEOAPIFY_API_KEY}`;
    const res = await fetch(url);
    if (!res.ok) {
        throw new Error(`Geoapify request failed: ${res.status} ${res.statusText}`);
    }
    const data = await res.json();
    return (data.features ?? []).map((feature) => ({
        name: feature.properties.name || 'Unnamed Provider',
        address: feature.properties.formatted || '',
        lat: feature.properties.lat,
        lng: feature.properties.lon,
        externalId: feature.properties.place_id,
        type,
    }));
}
//# sourceMappingURL=geoapify.js.map