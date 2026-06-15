import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      email: true,
      name: true,
      image: true,
      role: true,
      onboardingComplete: true,
      homeCountry: true,
      preferredLanguage: true,
      allergies: true,
      medications: true,
      emergencyContacts: true,
      bloodGroup: true,
    },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  return NextResponse.json(user);
}

export async function PUT(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { role, name, homeCountry, preferredLanguage, allergies, medications, emergencyContacts, onboardingComplete, bloodGroup } = body;

  const user = await prisma.user.upsert({
    where: { id: session.user.id },
    update: {
      ...(role !== undefined && { role }),
      ...(name !== undefined && { name }),
      ...(homeCountry !== undefined && { homeCountry }),
      ...(preferredLanguage !== undefined && { preferredLanguage }),
      ...(allergies !== undefined && { allergies: JSON.stringify(allergies) }),
      ...(medications !== undefined && { medications: JSON.stringify(medications) }),
      ...(emergencyContacts !== undefined && { emergencyContacts: JSON.stringify(emergencyContacts) }),
      ...(bloodGroup !== undefined && { bloodGroup }),
      ...(onboardingComplete !== undefined && { onboardingComplete }),
    },
    create: {
      id: session.user.id,
      email: session.user.email ?? `${session.user.id}@carecompass.local`,
      name: name ?? session.user.name ?? "User",
      image: session.user.image,
      role: role ?? "PATIENT",
      ...(homeCountry && { homeCountry }),
      ...(preferredLanguage && { preferredLanguage }),
      ...(allergies && { allergies: JSON.stringify(allergies) }),
      ...(medications && { medications: JSON.stringify(medications) }),
      ...(emergencyContacts && { emergencyContacts: JSON.stringify(emergencyContacts) }),
      ...(bloodGroup && { bloodGroup }),
      onboardingComplete: onboardingComplete ?? false,
    },
  });

  return NextResponse.json(user);
}
