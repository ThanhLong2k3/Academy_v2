import createMiddleware from 'next-intl/middleware';
import { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
export default createMiddleware({
  // A list of all locales that are supported
  locales: ['en', 'vi'],

  // Used when no locale matches
  defaultLocale: 'en',
});

export const config = {
  // Match only internationalized pathnames
  matcher: ['/', '/(vi|en)/:path*'],
};

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === '/vi') {
    return NextResponse.rewrite(new URL('/vi/login', request.url));
  }
  return NextResponse.next();
}
