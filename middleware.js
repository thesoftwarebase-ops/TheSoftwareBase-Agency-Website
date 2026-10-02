import { auth } from '@/auth';

export default auth((req) => {
  const path = req.nextUrl.pathname;
  const isAuth = !!req.auth;
  if (!isAuth && path.startsWith('/api/admin')) {
    return Response.json({ ok: false, error: 'Unauthorized.' }, { status: 401 });
  }
  if (!isAuth && (path === '/dashboard' || path.startsWith('/dashboard/'))) {
    const url = new URL('/login', req.nextUrl.origin);
    url.searchParams.set('callbackUrl', path);
    return Response.redirect(url);
  }
  return undefined;
});

export const config = {
  matcher: ['/dashboard/:path*', '/api/admin/:path*'],
};
