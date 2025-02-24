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

// export function middleware(request: NextRequest) {
//   if (request.nextUrl.pathname.startsWith('/vi')) {
//     return NextResponse.rewrite(new URL('/vi/login', request.url))
//   }

//   if (request.nextUrl.pathname.startsWith('/vi/customer')) {
//     return NextResponse.rewrite(new URL('/vi/customer', request.url))
//   }
// }
