import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";

export const { handlers, auth, signIn, signOut } = NextAuth({
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
        // Only allow this in development
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
    signIn: "/login",
  },
  trustHost: true,
  callbacks: {
    async session({ session, token }) {
      if (token?.sub) {
        session.user.id = token.sub;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id;
      }
      return token;
    },
  },
});
