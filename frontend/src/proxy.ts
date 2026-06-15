import { auth } from "@/auth";
import createMiddleware from "next-intl/middleware";

const LOCALES = ["en", "es", "fr", "de", "ja", "zh", "hi", "ar", "pt"] as const;

const intlMiddleware = createMiddleware({
  locales: LOCALES,
  defaultLocale: "en",
  localePrefix: "always",
});

export default auth((req) => {
  const { pathname } = req.nextUrl;

  // Strip locale prefix to get the bare path
  const localePattern = /^\/(en|es|fr|de|ja|zh|hi|ar|pt)(\/|$)/;
  const match = pathname.match(localePattern);
  const bare = match ? pathname.slice(match[0].length - (match[2] === "/" ? 1 : 0)) : pathname;

  // Only protect /app/* routes — everything else (marketing, login, api) is public
  const isProtected = bare.startsWith("/app");

  if (isProtected && !req.auth) {
    const locale = match ? match[1] : "en";
    const loginUrl = new URL(`/${locale}/login`, req.nextUrl.origin);
    loginUrl.searchParams.set("callbackUrl", req.nextUrl.pathname);
    return Response.redirect(loginUrl);
  }

  return intlMiddleware(req);
});

export const config = {
  // Skip api routes, Next.js internals, and static files
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)" ],
};
