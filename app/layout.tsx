// app/layout.tsx
import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Админ-панель',
  description: 'Управление контентом',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru">
      <body>
        <div className="app">
          <header className="header">
            <div className="headerInner">
              <h1 className="headerTitle">Админ-панель</h1>
              <a href="/" className="headerLink">На главную</a>
            </div>
          </header>
          <main className="main">{children}</main>
        </div>
      </body>
    </html>
  );
}