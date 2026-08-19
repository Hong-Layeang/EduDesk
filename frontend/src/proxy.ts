// import { NextResponse } from 'next/server';
// import type { NextRequest } from 'next/server';
// import { jwtDecode } from 'jwt-decode';
// import type { Role } from '@/config/roles';
// import { canAccessRoute } from '@/lib/permissions';
// import { Routes } from '@/config/routes';

// interface JwtPayload {
//   sub: string;
//   role: Role;
//   exp: number;
// }

// export function proxy(request: NextRequest) {
//   const { pathname } = request.nextUrl;
//   const token = request.cookies.get('access_token')?.value;

//   if (!token) {
//     return NextResponse.redirect(new URL(Routes.login, request.url));
//   }

//   try {
//     const payload = jwtDecode<JwtPayload>(token);

//     if (Date.now() / 1000 > payload.exp) {
//       return NextResponse.redirect(new URL(Routes.login, request.url));
//     }

//     if (!canAccessRoute(payload.role, pathname)) {
//       return NextResponse.redirect(new URL(Routes.notAuthorized, request.url));
//     }

//     return NextResponse.next();
//   } catch {
//     return NextResponse.redirect(new URL(Routes.login, request.url));
//   }
// }

// export const config = {
//   matcher: ['/super-admin/:path*', '/manager/:path*', '/staff/:path*'],
// };

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// TODO: re-enable auth guard before production
export function proxy(_request: NextRequest) {
  return NextResponse.next();
}

export const config = {
  matcher: ['/super-admin/:path*', '/manager/:path*', '/staff/:path*'],
};
