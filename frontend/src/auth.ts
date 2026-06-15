import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/db";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
    Credentials({
      id: "developer",
      name: "Developer Bypass",
      credentials: {
        email: { label: "Email", type: "email" },
      },
      async authorize(credentials) {
        if (process.env.NODE_ENV !== "production") {
          return {
            id: "dev-user-001",
            name: "Dev Traveler",
            email: (credentials?.email as string) ?? "dev@carecompass.local",
            image: null,
          };
        }
        return null;
      },
    }),
  ],
  pages: {
    signIn: "/en/login",
  },
  trustHost: true,
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (trigger === "update" && session) {
        const s = session as Record<string, unknown>;
        if (s.role) token.role = s.role as string;
        if (s.onboardingComplete !== undefined) token.onboardingComplete = s.onboardingComplete as boolean;
        return token;
      }
      if (user) {
        token.sub = user.id;
        const u = user as Record<string, unknown>;
        if (u.role) token.role = u.role as string;
        if (u.onboardingComplete !== undefined) token.onboardingComplete = u.onboardingComplete as boolean;
      }
      return token;
    },
    async session({ session, token }) {
      if (token?.sub) {
        session.user = {
          ...session.user,
          id: token.sub,
          role: token.role as string | undefined,
          onboardingComplete: token.onboardingComplete as boolean | undefined,
        };
      }
      return session;
    },
  },
});
