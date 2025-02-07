import { NextResponse } from 'next/server';
import { executeQuery } from '@/libs/db';

export async function db_Provider<T>(
  query: string,
  params: any[] = [],
  isModification = false,
) {
  try {
    const data: any = await executeQuery<T[]>(query, params);

    if (isModification) {
      // For POST, PATCH, DELETE operations
      return NextResponse.json({ result: data[0][0].RESULT }, { status: 200 });
    } else {
      // For GET operations
      return NextResponse.json(data[0]);
    }
  } catch (error) {
    console.error('Database operation error:', error);
    return NextResponse.json(
      { result: 1, error: 'Internal Server Error' },
      { status: 500 },
    );
  }
}
