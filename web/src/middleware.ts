import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const hostname = request.headers.get('host');
    const { pathname } = request.nextUrl;

    // Prevent rewriting requests to api, static files, or if already in a tenant path
    if (
        pathname.startsWith('/api/') ||
        pathname.startsWith('/_next/') ||
        pathname.startsWith('/static/') ||
        // If we have files in public, like images, usually they are served from root.
        // If we rewrite, we might break them unless we serve them.
        // However, existing image requests will go to /image.jpg.
        // If we rewrite /image.jpg -> /tenant-01/image.jpg, we need to make sure Next handles static assets at root correctly.
        // Next.js middleware usually ignores _next. 
        // Public files are tricky. Usually best to check if it's NOT a public file.
        // For simplicity, let's assume specific extensions are ignored.
        pathname.includes('.') ||
        pathname.startsWith('/tenant-')
    ) {
        return NextResponse.next();
    }

    let tenant = 'tenant-01'; // Default

    // Check hostname
    // Logic: 
    // ...-01.vercel.app -> tenant-01
    // ...-02.vercel.app -> tenant-02
    // ...-03.vercel.app -> tenant-03
    // localhost -> tenant-01 (default) or test via header

    if (hostname?.includes('-02.vercel.app')) {
        tenant = 'tenant-02';
    } else if (hostname?.includes('-03.vercel.app')) {
        tenant = 'tenant-03';
    } else if (hostname?.includes('-01.vercel.app')) {
        tenant = 'tenant-01';
    }

    // Allow overriding for local testing via search param (e.g. localhost:3000/?tenant=02)
    // Note: search params are on the URL.
    const forcedTenant = request.nextUrl.searchParams.get('tenant');
    if (forcedTenant && ['tenant-01', 'tenant-02', 'tenant-03'].includes('tenant-' + forcedTenant)) {
        tenant = 'tenant-' + forcedTenant;
    }

    // Rewrite /path -> /tenant-xx/path
    const url = request.nextUrl.clone();
    url.pathname = `/${tenant}${pathname}`;

    return NextResponse.rewrite(url);
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        '/((?!api|_next/static|_next/image|favicon.ico).*)',
    ],
};
