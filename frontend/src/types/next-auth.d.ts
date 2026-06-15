import { type DefaultSession } from "next-auth";
import { type DefaultJWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role?: string;
      onboardingComplete?: boolean;
      homeCountry?: string;
      preferredLanguage?: string;
      allergies?: string;
      medications?: string;
    } & DefaultSession["user"];
  }

  interface User {
    role?: string;
    onboardingComplete?: boolean;
    homeCountry?: string;
    preferredLanguage?: string;
    allergies?: string;
    medications?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    role?: string;
    onboardingComplete?: boolean;
    homeCountry?: string;
    preferredLanguage?: string;
  }
}
