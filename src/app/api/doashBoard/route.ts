import type { NextRequest } from 'next/server';
import { db_Provider } from '@/app/api/Api_Provider';
import type { IStatistics } from '@/models/boasBoard.model';
export async function GET(req: NextRequest) {
  try {
    const result = await db_Provider<IStatistics[]>('CALL GetStatistics()');
    return result;
  } catch (error) {
    console.error('Lỗi khi lấy danh sách thống kê:', error);
    throw new Error('Không thể lấy danh sách thống kê.');
  }
}
