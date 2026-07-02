// app/api/vacancies/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getVacancies, createVacancy } from '@/lib/vacancies-store';

// GET - список вакансий
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status') || 'active';
    
    const result = getVacancies({ page, limit, search, status });
    return NextResponse.json(result);
  } catch (error) {
    console.error('Ошибка при получении вакансий:', error);
    return NextResponse.json(
      { error: 'Ошибка загрузки вакансий' },
      { status: 500 }
    );
  }
}

// POST - создание вакансии
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    
    if (!data.title || !data.organization || !data.region) {
      return NextResponse.json(
        { error: 'Заполните обязательные поля' },
        { status: 400 }
      );
    }
    
    const newVacancy = createVacancy(data);
    return NextResponse.json(newVacancy, { status: 201 });
  } catch (error) {
    console.error('Ошибка при создании вакансии:', error);
    return NextResponse.json(
      { error: 'Ошибка создания вакансии' },
      { status: 500 }
    );
  }
}