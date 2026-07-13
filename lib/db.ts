import { Pool } from 'pg';

// Сеньор-деталь: Мы создаем ОДИН пул соединений на все приложение.
// Он автоматически берет строку DATABASE_URL из вашего файла .env
// и управляет открытыми подключениями, чтобы не перегружать память PostgreSQL.
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export default pool;
