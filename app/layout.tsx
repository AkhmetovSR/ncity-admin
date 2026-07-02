// app/layout.tsx
'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { logout, isAuthenticated } from '@/lib/auth';
import './globals.css';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    setIsAuth(isAuthenticated());
  }, [pathname]);

  const handleLogout = () => {
    logout();
    router.push('/auth/login');
    router.refresh();
  };

  const isLoginPage = pathname === '/auth/login';

  return (
    <html lang="ru">
      <body>
        <div className="app">
          <header className="header">
            <div className="headerInner">
              <h1 className="headerTitle">Админ-панель</h1>
              <div className="headerRight">
                {!isLoginPage && isAuth && (
                  <button onClick={handleLogout} className="headerLogout">
                    Выйти
                  </button>
                )}
                <a href="/" className="headerLink">На главную</a>
              </div>
            </div>
          </header>
          <main className="main">{children}</main>
        </div>
      </body>
    </html>
  );
}