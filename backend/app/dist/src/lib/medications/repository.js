import { prisma } from '@/lib/db';
export async function findLocalEquivalents(activeIngredientName, countryCode) {
    return prisma.medicationEdge.findMany({
        where: {
            country: { code: countryCode },
            activeIngredient: {
                name: { equals: activeIngredientName, mode: 'insensitive' }
            }
        },
        include: {
            brand: true,
            activeIngredient: true,
            country: true
        }
    });
}
//# sourceMappingURL=repository.js.map