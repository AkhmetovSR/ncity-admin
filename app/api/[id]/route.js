import { NextResponse } from 'next/server';
import { getVacancyById, updateVacancy, deleteVacancy } from '@/lib/vacancies-store';

// ============================================
// GET - получить одну вакансию по ID
// ============================================
export async function GET(request, { params }) {
  try {
    // Получаем ID из URL
    const { id } = await params;
    const vacancyId = parseInt(id);
    
    // Проверяем, что ID - число
    if (isNaN(vacancyId)) {
      return NextResponse.json(
        { error: 'Неверный формат ID' },
        { status: 400 }
      );
    }
    
    // Ищем вакансию
    const vacancy = getVacancyById(vacancyId);
    
    // Если не найдена - 404
    if (!vacancy) {
      return NextResponse.json(
        { error: 'Вакансия не найдена' },
        { status: 404 }
      );
    }
    
    // Возвращаем вакансию
    return NextResponse.json(vacancy);
    
  } catch (error) {
    console.error('Ошибка при получении вакансии:', error);
    
    return NextResponse.json(
      { error: 'Ошибка загрузки вакансии' },
      { status: 500 }
    );
  }
}

// ============================================
// PUT - обновить вакансию
// ============================================
export async function PUT(request, { params }) {
  try {
    // Получаем ID из URL
    const { id } = await params;
    const vacancyId = parseInt(id);
    
    // Проверяем ID
    if (isNaN(vacancyId)) {
      return NextResponse.json(
        { error: 'Неверный формат ID' },
        { status: 400 }
      );
    }
    
    // Получаем данные из тела запроса
    const data = await request.json();
    
    // Обновляем вакансию
    const updated = updateVacancy(vacancyId, data);
    
    // Если не найдена - 404
    if (!updated) {
      return NextResponse.json(
        { error: 'Вакансия не найдена' },
        { status: 404 }
      );
    }
    
    // Возвращаем обновлённую вакансию
    return NextResponse.json(updated);
    
  } catch (error) {
    console.error('Ошибка при обновлении вакансии:', error);
    
    return NextResponse.json(
      { error: 'Ошибка обновления вакансии' },
      { status: 500 }
    );
  }
}

// ============================================
// DELETE - удалить вакансию (soft delete)
// ============================================
export async function DELETE(request, { params }) {
  try {
    // Получаем ID из URL
    const { id } = await params;
    const vacancyId = parseInt(id);
    
    // Проверяем ID
    if (isNaN(vacancyId)) {
      return NextResponse.json(
        { error: 'Неверный формат ID' },
        { status: 400 }
      );
    }
    
    // Удаляем вакансию
    const result = deleteVacancy(vacancyId);
    
    // Если не найдена - 404
    if (!result) {
      return NextResponse.json(
        { error: 'Вакансия не найдена' },
        { status: 404 }
      );
    }
    
    // Возвращаем успех
    return NextResponse.json({ 
      success: true, 
      message: 'Вакансия удалена' 
    });
    
  } catch (error) {
    console.error('Ошибка при удалении вакансии:', error);
    
    return NextResponse.json(
      { error: 'Ошибка удаления вакансии' },
      { status: 500 }
    );
  }
}