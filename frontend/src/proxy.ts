import { auth } from "@/auth";
import createMiddleware from 'next-intl/middleware';

const intlMiddleware = createMiddleware({
  locales: ['en', 'es', 'fr', 'de', 'ja', 'zh', 'hi', 'ar', 'pt'],
  defaultLocale: 'en',
  localePrefix: 'always',
});

export default auth((req) => {
  const isAuth = !!req.auth;
  const { pathname } = req.nextUrl;

  // Parse locale and check if target route is under /app
  const hasLocale = pathname.match(/^\/(en|es|fr|de|ja|zh|hi|ar|pt)(\/|$)/);
  const pathWithoutLocale = hasLocale ? pathname.replace(/^\/[a-z]{2}/, '') : pathname;

  if (pathWithoutLocale.startsWith('/app') && !isAuth) {
    const locale = hasLocale ? pathname.split('/')[1] : 'en';
    const loginUrl = new URL(`/${locale}/login`, req.nextUrl.origin);
    return Response.redirect(loginUrl);
  }

  return intlMiddleware(req);
});

export const config = {
  // Match all paths except Next.js internals, static files, and API routes
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)',
  ],
};
