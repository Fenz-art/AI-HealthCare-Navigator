import { prisma } from '../db.js';
import { getUserActivity } from '../real-time/service.js';
import type { VerificationStatus, VerificationType } from '@prisma/client';

export async function getOrCreateWorkspace(userId: string, role: string) {
  const existing = await prisma.providerWorkspace.findUnique({ where: { userId } });
  if (existing) return existing;

  return prisma.providerWorkspace.create({
    data: { userId, role },
  });
}

export async function getWorkspace(userId: string) {
  return prisma.providerWorkspace.findUnique({
    where: { userId },
    include: { verifications: true },
  });
}

export async function updateWorkspace(
  userId: string,
  data: {
    specialties?: string[];
    languages?: string[];
    organization?: string;
    availability?: Record<string, unknown>;
    isActive?: boolean;
  },
) {
  const updateData: Record<string, unknown> = {};
  if (data.specialties !== undefined) updateData.specialties = JSON.stringify(data.specialties);
  if (data.languages !== undefined) updateData.languages = JSON.stringify(data.languages);
  if (data.organization !== undefined) updateData.organization = data.organization;
  if (data.availability !== undefined) updateData.availability = JSON.stringify(data.availability);
  if (data.isActive !== undefined) updateData.isActive = data.isActive;

  return prisma.providerWorkspace.update({
    where: { userId },
    data: updateData,
  });
}

export async function getWorkspaceById(id: string) {
  return prisma.providerWorkspace.findUnique({
    where: { id },
    include: { verifications: true },
  });
}

export async function getAllWorkspacesByRole(role: string) {
  return prisma.providerWorkspace.findMany({
    where: { role },
    include: { verifications: true },
  });
}

export async function submitVerification(data: {
  providerId: string;
  type: VerificationType;
  documentUrl?: string;
  documentName?: string;
}) {
  return prisma.verification.create({
    data: {
      providerId: data.providerId,
      type: data.type,
      documentUrl: data.documentUrl ?? null,
      documentName: data.documentName ?? null,
    },
  });
}

export async function updateVerificationStatus(
  id: string,
  status: VerificationStatus,
  verifiedBy?: string,
  notes?: string,
) {
  const updateData: Record<string, unknown> = { status };
  if (status === 'VERIFIED' || status === 'REJECTED') {
    updateData.verifiedAt = new Date();
  }
  if (verifiedBy !== undefined) updateData.verifiedBy = verifiedBy;
  if (notes !== undefined) updateData.notes = notes;

  return prisma.verification.update({
    where: { id },
    data: updateData,
  });
}

export async function getVerifications(providerId: string) {
  return prisma.verification.findMany({
    where: { providerId },
    orderBy: { createdAt: 'desc' },
  });
}

export async function getProviderActivityFeed(userId: string, limit = 50) {
  return getUserActivity(userId, limit);
}
