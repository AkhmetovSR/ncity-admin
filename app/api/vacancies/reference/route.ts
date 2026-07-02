// app/api/vacancies/reference/route.ts
import { NextResponse } from 'next/server';
import { getReferenceData } from '@/lib/vacancies-store';

export async function GET() {
  try {
    const data = getReferenceData();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Ошибка при получении справочников:', error);
    return NextResponse.json(
      { error: 'Ошибка загрузки справочников' },
      { status: 500 }
    );
  }
}