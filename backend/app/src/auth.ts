import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/db";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async session({ session, user }) {
      session.user.id = user.id;
      // Append custom fields to session
      if (user.homeCountry) session.user.homeCountry = user.homeCountry;
      if (user.preferredLanguage) session.user.preferredLanguage = user.preferredLanguage;
      if (user.allergies) session.user.allergies = user.allergies;
      if (user.medications) session.user.medications = user.medications;
      if (user.role) session.user.role = user.role;
      if (user.onboardingComplete !== undefined) session.user.onboardingComplete = user.onboardingComplete;
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
});
