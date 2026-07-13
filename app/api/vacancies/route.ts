import { NextResponse } from 'next/server';
import pool from '@/lib/db';

// 1. ПОЛУЧЕНИЕ СПИСКА ВАКАНСИЙ (С ПОИСКОМ)
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    
    let queryText = '';
    let values: any[] = [];

    if (search.trim() !== '') {
      // Если есть поисковый запрос, ищем по названию вакансии или компании (регистронезависимо)
      queryText = `
        SELECT * FROM vacancies 
        WHERE title ILIKE $1 OR company_name ILIKE $1
        ORDER BY created_at DESC;
      `;
      values = [`%${search}%`];
    } else {
      // Если поиска нет, отдаем вообще все вакансии
      queryText = `SELECT * FROM vacancies ORDER BY created_at DESC;`;
    }

    const result = await pool.query(queryText, values);

    // Фронтенд ожидает объект { data: [...] }
    return NextResponse.json({ data: result.rows }, { status: 200 });
  } catch (error) {
    console.error('Ошибка API при получении вакансий:', error);
    return NextResponse.json({ error: 'Ошибка сервера при чтении из БД' }, { status: 500 });
  }
}

// 2. СОЗДАНИЕ НОВОЙ ВАКАНСИИ
export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    const {
      title,
      salary,
      company_name,
      schedule,
      region,
      address,
      experience,
      education,
      contact_phone,
      contact_email,
      contact_website,
      description,
      requirements
    } = body;

    // Проверка обязательных полей на стороне бэкенда (Senior-валидация)
    if (!title || !company_name || !region || !schedule || !description) {
      return NextResponse.json({ error: 'Пропущены обязательные поля' }, { status: 400 });
    }

    // Чистый SQL-запрос со строгой защитой от SQL-инъекций через плейсхолдеры ($1, $2...)
    const queryText = `
      INSERT INTO vacancies (
        title, salary, company_name, schedule, region, address, 
        experience, education, contact_phone, contact_email, 
        contact_website, description, requirements
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
      RETURNING *;
    `;

    const values = [
      title,
      salary !== undefined ? salary : null,
      company_name,
      schedule,
      region,
      address || null,
      experience || null,
      education || null,
      contact_phone || null,
      contact_email || null,
      contact_website || null,
      description,
      requirements || null
    ];

    const result = await pool.query(queryText, values);

    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (error) {
    console.error('Ошибка API при создании вакансии:', error);
    return NextResponse.json({ error: 'Ошибка сервера при записи в БД' }, { status: 500 });
  }
}
