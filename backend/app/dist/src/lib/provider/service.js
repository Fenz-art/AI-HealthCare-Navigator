import { prisma } from '../db.js';
import { getUserActivity } from '../real-time/service.js';
export async function getOrCreateWorkspace(userId, role) {
    const existing = await prisma.providerWorkspace.findUnique({ where: { userId } });
    if (existing)
        return existing;
    return prisma.providerWorkspace.create({
        data: { userId, role },
    });
}
export async function getWorkspace(userId) {
    return prisma.providerWorkspace.findUnique({
        where: { userId },
        include: { verifications: true },
    });
}
export async function updateWorkspace(userId, data) {
    const updateData = {};
    if (data.specialties !== undefined)
        updateData.specialties = JSON.stringify(data.specialties);
    if (data.languages !== undefined)
        updateData.languages = JSON.stringify(data.languages);
    if (data.organization !== undefined)
        updateData.organization = data.organization;
    if (data.availability !== undefined)
        updateData.availability = JSON.stringify(data.availability);
    if (data.isActive !== undefined)
        updateData.isActive = data.isActive;
    return prisma.providerWorkspace.update({
        where: { userId },
        data: updateData,
    });
}
export async function getWorkspaceById(id) {
    return prisma.providerWorkspace.findUnique({
        where: { id },
        include: { verifications: true },
    });
}
export async function getAllWorkspacesByRole(role) {
    return prisma.providerWorkspace.findMany({
        where: { role },
        include: { verifications: true },
    });
}
export async function submitVerification(data) {
    return prisma.verification.create({
        data: {
            providerId: data.providerId,
            type: data.type,
            documentUrl: data.documentUrl ?? null,
            documentName: data.documentName ?? null,
        },
    });
}
export async function updateVerificationStatus(id, status, verifiedBy, notes) {
    const updateData = { status };
    if (status === 'VERIFIED' || status === 'REJECTED') {
        updateData.verifiedAt = new Date();
    }
    if (verifiedBy !== undefined)
        updateData.verifiedBy = verifiedBy;
    if (notes !== undefined)
        updateData.notes = notes;
    return prisma.verification.update({
        where: { id },
        data: updateData,
    });
}
export async function getVerifications(providerId) {
    return prisma.verification.findMany({
        where: { providerId },
        orderBy: { createdAt: 'desc' },
    });
}
export async function getProviderActivityFeed(userId, limit = 50) {
    return getUserActivity(userId, limit);
}
//# sourceMappingURL=service.js.map