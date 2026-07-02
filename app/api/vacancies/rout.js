import { NextResponse } from 'next/server';
import { getVacancies, createVacancy } from '@/lib/vacancies-store';

// ============================================
// GET - получить список вакансий
// ============================================
export async function GET(request) {
  try {
    // Получаем параметры из URL
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 20;
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status') || 'active';
    
    // Получаем данные из хранилища
    const result = getVacancies({ 
      page, 
      limit, 
      search, 
      status 
    });
    
    // Возвращаем JSON-ответ
    return NextResponse.json(result);
    
  } catch (error) {
    console.error('Ошибка при получении вакансий:', error);
    
    return NextResponse.json(
      { error: 'Ошибка загрузки вакансий' },
      { status: 500 }
    );
  }
}

// ============================================
// POST - создать новую вакансию
// ============================================
export async function POST(request) {
  try {
    // Получаем данные из тела запроса
    const data = await request.json();
    
    // Валидация обязательных полей
    if (!data.title || !data.organization || !data.region) {
      return NextResponse.json(
        { 
          error: 'Заполните обязательные поля',
          required: ['title', 'organization', 'region']
        },
        { status: 400 }
      );
    }
    
    // Создаём вакансию
    const newVacancy = createVacancy(data);
    
    // Возвращаем созданную вакансию
    return NextResponse.json(newVacancy, { status: 201 });
    
  } catch (error) {
    console.error('Ошибка при создании вакансии:', error);
    
    return NextResponse.json(
      { error: 'Ошибка создания вакансии' },
      { status: 500 }
    );
  }
}