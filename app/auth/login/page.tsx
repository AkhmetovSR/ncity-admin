// app/auth/login/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { verifyPassword, createAuthCookie } from '@/lib/auth';
import s from './login.module.css';

export default function LoginPage() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Имитируем небольшую задержку (для красоты)
    setTimeout(() => {
      if (verifyPassword(password)) {
        // Пароль верный — создаем куку и перенаправляем
        createAuthCookie();
        router.push('/');
        router.refresh();
      } else {
        setError('Неверный пароль');
        setPassword('');
        setLoading(false);
      }
    }, 500);
  };

  return (
    <div className={s.page}>
      <div className={s.card}>
        <h1 className={s.title}>Вход в админ-панель</h1>
        <p className={s.subtitle}>Введите пароль для доступа</p>

        <form onSubmit={handleSubmit} className={s.form}>
          <input
            type="password"
            className={s.input}
            placeholder="Введите пароль"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
            autoFocus
          />

          {error && <div className={s.error}>{error}</div>}

          <button type="submit" className={s.button} disabled={loading}>
            {loading ? 'Проверка...' : 'Войти'}
          </button>
        </form>
      </div>
    </div>
  );
}