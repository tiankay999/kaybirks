import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
    const token = await getToken({
        req: request,
        secret: process.env.NEXTAUTH_SECRET,
    });

    const { pathname } = request.nextUrl;

    // Protect admin routes
    if (pathname.startsWith('/admin')) {
        if (!token) {
            return NextResponse.redirect(new URL('/login?callbackUrl=/admin', request.url));
        }
        if (token.role !== 'ADMIN') {
            return NextResponse.redirect(new URL('/', request.url));
        }
    }

    // Protect account routes
    if (pathname.startsWith('/account')) {
        if (!token) {
            return NextResponse.redirect(new URL('/login?callbackUrl=' + pathname, request.url));
        }
    }

    // Protect checkout
    if (pathname.startsWith('/checkout') && !pathname.includes('/confirmation')) {
        if (!token) {
            return NextResponse.redirect(new URL('/login?callbackUrl=/checkout', request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/admin/:path*', '/account/:path*', '/checkout'],
};
