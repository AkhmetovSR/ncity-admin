import { NextResponse } from 'next/server';
import pool from '@/lib/db';

// 1. ОБНОВЛЕНИЕ СУЩЕСТВУЮЩЕЙ ВАКАНСИИ
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
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

    // SQL-запрос для обновления полей и автоматического обновления даты изменения updated_at
    const queryText = `
      UPDATE vacancies
      SET 
        title = $1, 
        salary = $2, 
        company_name = $3, 
        schedule = $4, 
        region = $5, 
        address = $6, 
        experience = $7, 
        education = $8, 
        contact_phone = $9, 
        contact_email = $10, 
        contact_website = $11, 
        description = $12, 
        requirements = $13,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $14
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
      requirements || null,
      parseInt(id, 10) // Переводим строковый ID из URL в число для PostgreSQL
    ];

    const result = await pool.query(queryText, values);

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Вакансия не найдена' }, { status: 404 });
    }

    return NextResponse.json(result.rows[0], { status: 200 });
  } catch (error) {
    console.error('Ошибка API при обновлении вакансии:', error);
    return NextResponse.json({ error: 'Ошибка сервера при обновлении БД' }, { status: 500 });
  }
}

// 2. ПОЛНОЕ УДАЛЕНИЕ ВАКАНСИИ ИЗ БД
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const vacancyId = parseInt(id, 10);

    const queryText = `DELETE FROM vacancies WHERE id = $1 RETURNING *;`;
    const result = await pool.query(queryText, [vacancyId]);

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Вакансия для удаления не найдена' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Вакансия успешно удалена' }, { status: 200 });
  } catch (error) {
    console.error('Ошибка API при удалении вакансии:', error);
    return NextResponse.json({ error: 'Ошибка сервера при удалении из БД' }, { status: 500 });
  }
}
