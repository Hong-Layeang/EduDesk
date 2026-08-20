import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// TODO: re-enable auth guard before production
export function proxy(_request: NextRequest) {
  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/students/:path*', '/scores/:path*', '/reports/:path*'],
};
