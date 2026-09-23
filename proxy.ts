import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

import { verifyJWT } from './lib/auth';

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('admin_token')?.value;

  if (pathname === '/admin/login') {
    if (token) {
      const payload = await verifyJWT(token);

      if (payload?.role === 'ADMIN') {
        const response = NextResponse.redirect(new URL('/admin/calendar', request.url));
        response.headers.set('Cache-Control', 'no-store, max-age=0');
        return response;
      }
    }

    return NextResponse.next();
  }

  if (pathname.startsWith('/api/auth/')) {
    return NextResponse.next();
  }

  if (!pathname.startsWith('/admin')) {
    return NextResponse.next();
  }

  if (!token) {
    const response = NextResponse.redirect(new URL('/admin/login', request.url));
    response.headers.set('Cache-Control', 'no-store, max-age=0');
    return response;
  }

  const payload = await verifyJWT(token);

  if (!payload || payload.role !== 'ADMIN') {
    const response = NextResponse.redirect(new URL('/admin/login', request.url));
    response.cookies.delete('admin_token');
    response.headers.set('Cache-Control', 'no-store, max-age=0');
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/api/auth/:path*'],
};
