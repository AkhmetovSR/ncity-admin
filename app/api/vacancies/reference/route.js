import { NextResponse } from 'next/server';
import { getReferenceData } from '@/lib/vacancies-store';

// ============================================
// GET - получить все справочники для формы
// ============================================
export async function GET() {
  try {
    // Получаем справочные данные
    const data = getReferenceData();
    
    // Возвращаем JSON
    return NextResponse.json(data);
    
  } catch (error) {
    console.error('Ошибка при получении справочников:', error);
    
    return NextResponse.json(
      { error: 'Ошибка загрузки справочников' },
      { status: 500 }
    );
  }
}