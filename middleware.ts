// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Проверяем, есть ли кука авторизации
  const authCookie = request.cookies.get('admin_auth');
  
  // Парсим куку
  let isAuth = false;
  if (authCookie) {
    try {
      const data = JSON.parse(decodeURIComponent(authCookie.value));
      if (data.expires > Date.now()) {
        isAuth = true;
      }
    } catch {
      isAuth = false;
    }
  }

  const path = request.nextUrl.pathname;
  
  // Если не авторизован и пытается зайти на защищенную страницу
  if (!isAuth) {
    // Защищенные страницы (все, кроме /auth/login)
    const isAuthPage = path.startsWith('/auth/login');
    
    if (!isAuthPage) {
      // Перенаправляем на страницу входа
      const url = new URL('/auth/login', request.url);
      url.searchParams.set('redirect', path);
      return NextResponse.redirect(url);
    }
    
    return NextResponse.next();
  }

  // Если авторизован и пытается зайти на /auth/login — перенаправляем на главную
  if (path.startsWith('/auth/login')) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

// Защищаем все страницы, кроме статических файлов
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};