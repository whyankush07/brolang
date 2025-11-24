
import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

export const config = {
    matcher: ['/login', '/playground'],
};

export default async function middleware(request: NextRequest) {

    const token = await getToken({ req: request });
    const url = request.nextUrl;

    if (
        token &&
        (url.pathname.startsWith('/login'))
    ) {
        return NextResponse.redirect(new URL('/', request.url));
    }

    if (
        !token && url.pathname.startsWith('/playground')
    ) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    return NextResponse.next();
}