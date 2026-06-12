import { PrismaClient, OtcStatus, DoseRule } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const countries = await Promise.all([
    prisma.country.upsert({ where: { code: 'US' }, update: {}, create: { name: 'United States', code: 'US' } }),
    prisma.country.upsert({ where: { code: 'IN' }, update: {}, create: { name: 'India', code: 'IN' } }),
    prisma.country.upsert({ where: { code: 'JP' }, update: {}, create: { name: 'Japan', code: 'JP' } }),
    prisma.country.upsert({ where: { code: 'GB' }, update: {}, create: { name: 'United Kingdom', code: 'GB' } }),
    prisma.country.upsert({ where: { code: 'DE' }, update: {}, create: { name: 'Germany', code: 'DE' } }),
    prisma.country.upsert({ where: { code: 'FR' }, update: {}, create: { name: 'France', code: 'FR' } }),
    prisma.country.upsert({ where: { code: 'BR' }, update: {}, create: { name: 'Brazil', code: 'BR' } }),
    prisma.country.upsert({ where: { code: 'IT' }, update: {}, create: { name: 'Italy', code: 'IT' } }),
    prisma.country.upsert({ where: { code: 'ES' }, update: {}, create: { name: 'Spain', code: 'ES' } }),
    prisma.country.upsert({ where: { code: 'MX' }, update: {}, create: { name: 'Mexico', code: 'MX' } }),
    prisma.country.upsert({ where: { code: 'AU' }, update: {}, create: { name: 'Australia', code: 'AU' } }),
    prisma.country.upsert({ where: { code: 'TH' }, update: {}, create: { name: 'Thailand', code: 'TH' } }),
    prisma.country.upsert({ where: { code: 'VN' }, update: {}, create: { name: 'Vietnam', code: 'VN' } }),
    prisma.country.upsert({ where: { code: 'KR' }, update: {}, create: { name: 'South Korea', code: 'KR' } }),
    prisma.country.upsert({ where: { code: 'SE' }, update: {}, create: { name: 'Sweden', code: 'SE' } }),
    prisma.country.upsert({ where: { code: 'AE' }, update: {}, create: { name: 'UAE', code: 'AE' } }),
    prisma.country.upsert({ where: { code: 'ZA' }, update: {}, create: { name: 'South Africa', code: 'ZA' } }),
    prisma.country.upsert({ where: { code: 'NG' }, update: {}, create: { name: 'Nigeria', code: 'NG' } }),
    prisma.country.upsert({ where: { code: 'TR' }, update: {}, create: { name: 'Turkey', code: 'TR' } }),
    prisma.country.upsert({ where: { code: 'EG' }, update: {}, create: { name: 'Egypt', code: 'EG' } }),
  ]);

  const ingredientNames = [
    'Paracetamol', 'Ibuprofen', 'Loperamide', 'Cetirizine', 'Omeprazole',
    'Simethicone', 'Bismuth Subsalicylate', 'Oral Rehydration Salts', 'Hydrocortisone', 'Clotrimazole',
    'Diclofenac', 'Naproxen', 'Diphenhydramine', 'Loratadine', 'Famotidine',
    'Ranitidine', 'Dimenhydrinate', 'Meclizine', 'Mupirocin', 'Bacitracin',
    'Neomycin', 'Polymyxin B', 'Tolnaftate', 'Ketoconazole', 'Guaifenesin',
    'Dextromethorphan', 'Pseudoephedrine', 'Phenylephrine', 'Salbutamol', 'Fluticasone'
  ];

  const ingredients = await Promise.all(
    ingredientNames.map((name) => prisma.activeIngredient.upsert({
      where: { name },
      update: {},
      create: { name }
    }))
  );

  const mappings = [
    { ingredient: 'Paracetamol', country: 'US', brand: 'Tylenol', status: OtcStatus.FULL_OTC },
    { ingredient: 'Paracetamol', country: 'IN', brand: 'Crocin', status: OtcStatus.FULL_OTC },
    { ingredient: 'Paracetamol', country: 'JP', brand: 'Bufferin Luna', status: OtcStatus.FULL_OTC },
    { ingredient: 'Ibuprofen', country: 'US', brand: 'Advil', status: OtcStatus.FULL_OTC },
    { ingredient: 'Ibuprofen', country: 'GB', brand: 'Nurofen', status: OtcStatus.FULL_OTC },
    { ingredient: 'Loperamide', country: 'US', brand: 'Imodium A-D', status: OtcStatus.FULL_OTC },
    { ingredient: 'Loperamide', country: 'TH', brand: 'Imodium', status: OtcStatus.PHARMACY_ONLY },
    { ingredient: 'Cetirizine', country: 'US', brand: 'Zyrtec', status: OtcStatus.FULL_OTC },
    { ingredient: 'Bismuth Subsalicylate', country: 'US', brand: 'Pepto-Bismol', status: OtcStatus.FULL_OTC },
    { ingredient: 'Omeprazole', country: 'US', brand: 'Prilosec', status: OtcStatus.FULL_OTC },
    { ingredient: 'Omeprazole', country: 'IN', brand: 'Omez', status: OtcStatus.PHARMACY_ONLY },
    { ingredient: 'Diclofenac', country: 'IN', brand: 'Voveran', status: OtcStatus.PHARMACY_ONLY },
    { ingredient: 'Diphenhydramine', country: 'US', brand: 'Benadryl', status: OtcStatus.FULL_OTC },
    { ingredient: 'Dimenhydrinate', country: 'US', brand: 'Dramamine', status: OtcStatus.FULL_OTC },
  ];

  for (const map of mappings) {
    const ingredient = ingredients.find((item) => item.name === map.ingredient)!;
    const country = countries.find((item) => item.code === map.country)!;

    const brand = await prisma.brand.upsert({
      where: { name_countryId: { name: map.brand, countryId: country.id } },
      update: {},
      create: {
        name: map.brand,
        countryId: country.id,
        activeIngredientId: ingredient.id,
        otcStatus: map.status,
        doseRule: DoseRule.STANDARD_OTC
      }
    });

    await prisma.medicationEdge.upsert({
      where: {
        activeIngredientId_countryId_brandId: {
          activeIngredientId: ingredient.id,
          countryId: country.id,
          brandId: brand.id
        }
      },
      update: {},
      create: {
        activeIngredientId: ingredient.id,
        countryId: country.id,
        brandId: brand.id
      }
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
    console.log('Seed complete');
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
