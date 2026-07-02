// app/page.tsx
'use client';

import Link from 'next/link';

interface Section {
  id: string;
  title: string;
  desc: string;
  href: string;
  color: string;
}

export default function HomePage() {
  const sections: Section[] = [
    {
      id: 'vacancies',
      title: '💼 Вакансии',
      desc: 'Управление вакансиями',
      href: '/vacancies',
      color: '#2563eb',
    },
    {
      id: 'companies',
      title: '🏢 Компании',
      desc: 'Управление компаниями',
      href: '/companies',
      color: '#059669',
    },
    {
      id: 'users',
      title: '👤 Пользователи',
      desc: 'Управление пользователями',
      href: '/users',
      color: '#7c3aed',
    },
  ];

  return (
    <div className="home">
      <h1 className="homeTitle">Панель управления</h1>
      <div className="homeGrid">
        {sections.map((item) => (
          <Link
            key={item.id}
            href={item.href}
            className="homeCard"
            style={{ borderTop: `4px solid ${item.color}` }}
          >
            <div className="homeCardIcon">{item.title.split(' ')[0]}</div>
            <h2 className="homeCardTitle">{item.title}</h2>
            <p className="homeCardDesc">{item.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}