import { Pool } from 'pg';

// Проверяем: если мы работаем на вашем личном компьютере (нет специальной системной переменной),
// то принудительно используем localhost, чтобы достучаться до локального Докера.
const isLocal = !process.env.VERCEL && process.env.NODE_ENV !== 'production';

const connectionString = isLocal
    ? 'postgresql://adm:Parol!@localhost:5432/ncity_db' // Для вашего ПК
    : process.env.DATABASE_URL; // Для продакшена на VPS

const pool = new Pool({
  connectionString,
});

export default pool;
