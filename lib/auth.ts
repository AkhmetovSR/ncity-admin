// lib/auth.ts

// Пароль для входа (хранится в переменной окружения)
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'zxcvbn';

// Проверка пароля
export function verifyPassword(password: string): boolean {
  return password === ADMIN_PASSWORD;
}

// Проверка авторизации (по куки)
export function isAuthenticated(): boolean {
  if (typeof window === 'undefined') return false;
  
  // Проверяем наличие куки с авторизацией
  const cookies = document.cookie.split('; ');
  const authCookie = cookies.find(row => row.startsWith('admin_auth='));
  
  if (!authCookie) return false;
  
  const value = authCookie.split('=')[1];
  
  // Проверяем, что кука валидна (не истекла)
  try {
    const data = JSON.parse(decodeURIComponent(value));
    const now = Date.now();
    
    return data.expires > now;
  } catch {
    return false;
  }
}

// Создание куки авторизации (на 7 дней)
export function createAuthCookie(): void {
  const data = {
    authenticated: true,
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 дней
  };
  
  document.cookie = `admin_auth=${encodeURIComponent(JSON.stringify(data))}; path=/; max-age=${7 * 24 * 60 * 60}; SameSite=Lax`;
}

// Удаление куки (выход)
export function logout(): void {
  document.cookie = 'admin_auth=; path=/; max-age=0';
}