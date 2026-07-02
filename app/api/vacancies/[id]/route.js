// app/api/vacancies/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getVacancyById, updateVacancy, deleteVacancy } from '@/lib/vacancies-store';

type Params = {
  params: Promise<{ id: string }>;
};

// GET - получить одну вакансию
export async function GET(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const vacancyId = parseInt(id);
    
    if (isNaN(vacancyId)) {
      return NextResponse.json(
        { error: 'Неверный формат ID' },
        { status: 400 }
      );
    }
    
    const vacancy = getVacancyById(vacancyId);
    
    if (!vacancy) {
      return NextResponse.json(
        { error: 'Вакансия не найдена' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(vacancy);
  } catch (error) {
    console.error('Ошибка при получении вакансии:', error);
    return NextResponse.json(
      { error: 'Ошибка загрузки вакансии' },
      { status: 500 }
    );
  }
}

// PUT - обновить вакансию
export async function PUT(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const vacancyId = parseInt(id);
    
    if (isNaN(vacancyId)) {
      return NextResponse.json(
        { error: 'Неверный формат ID' },
        { status: 400 }
      );
    }
    
    const data = await request.json();
    const updated = updateVacancy(vacancyId, data);
    
    if (!updated) {
      return NextResponse.json(
        { error: 'Вакансия не найдена' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(updated);
  } catch (error) {
    console.error('Ошибка при обновлении вакансии:', error);
    return NextResponse.json(
      { error: 'Ошибка обновления вакансии' },
      { status: 500 }
    );
  }
}

// DELETE - удалить вакансию (soft delete)
export async function DELETE(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const vacancyId = parseInt(id);
    
    if (isNaN(vacancyId)) {
      return NextResponse.json(
        { error: 'Неверный формат ID' },
        { status: 400 }
      );
    }
    
    const result = deleteVacancy(vacancyId);
    
    if (!result) {
      return NextResponse.json(
        { error: 'Вакансия не найдена' },
        { status: 404 }
      );
    }
    
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