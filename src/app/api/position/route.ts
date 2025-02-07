import type { NextRequest } from 'next/server';
import { db_Provider } from '@/app/api/Api_Provider';
import type { GetPosition, AddPosistion } from '@/models/position.model';

export async function GET() {
  return db_Provider<GetPosition[]>('CALL GetPositions()');
}

export async function getPositionsByPageOrder(
  pageIndex: number,
  pageSize: number,
  orderType: 'ASC' | 'DESC',
) {
  try {
    const result = await db_Provider<GetPosition[]>(
      `CALL GetPositionsByPageOrder(${pageIndex}, ${pageSize}, '${orderType}')`,
    );
    return result;
  } catch (error) {
    console.error('Lỗi khi lấy danh sách chức vụ:', error);
    throw new Error('Không thể lấy danh sách chức vụ.');
  }
}

export async function POST(request: NextRequest) {
  const body: AddPosistion = await request.json();
  return db_Provider<any>('CALL AddPosition(?)', [body.PositionName], true);
}

export async function PATCH(request: NextRequest) {
  const body: GetPosition = await request.json();
  return db_Provider<any>(
    'CALL UpdatePosition(?,?)',
    [body.Id, body.PositionName],
    true,
  );
}

export async function DELETE(request: NextRequest) {
  const id = request.nextUrl.searchParams.get('id');
  if (!id) {
    return new Response('Missing ID', { status: 400 });
  }
  return db_Provider<any>('CALL DeletePosition(?)', [id], true);
}
