import type { NextRequest } from 'next/server';
import { db_Provider } from '@/app/api/Api_Provider';
import type { GetUser, AddUser, UpUser } from '@/models/user.model';
import storage from '@/utils/storage';
import { ROLE } from '@/constants/config';
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const pageIndex = Number(searchParams.get('pageIndex')) || 1;
  const pageSize = Number(searchParams.get('pageSize')) || 10;
  const orderType = (searchParams.get('orderType') as 'ASC' | 'DESC') || 'ASC';
  const FullName = searchParams.get('fullName') || undefined;

  return getUsersByPageOrder(pageIndex, pageSize, orderType, FullName);
}

export async function getUsersByPageOrder(
  pageIndex: number,
  pageSize: number,
  orderType: 'ASC' | 'DESC',
  FullName?: string,
) {
  try {
    const result = await db_Provider<GetUser[]>(
      'CALL GetUsersByPageOrder(?, ?, ?, ?)',
      [pageIndex, pageSize, orderType, FullName || null],
    );
    return result;
  } catch (error) {
    console.error('Lỗi khi lấy danh sách người dùng:', error);
    throw new Error('Không thể lấy danh sách người dùng.');
  }
}

export async function POST(request: NextRequest) {
  const body: AddUser = await request.json();
  return db_Provider<any>(
    'CALL AddUser(?,?,?,?)',
    [body.Email, body.Password, body.FullName, body.Role],
    true,
  );
}

export async function PATCH(request: NextRequest) {
  const body: UpUser = await request.json();
  return db_Provider<any>(
    'CALL UpdateUser(?,?,?,?,?)',
    [body.Id, body.Email, body.Password, body.FullName, body.Role],
    true,
  );
}

export async function DELETE(request: NextRequest) {
  const id = request.nextUrl.searchParams.get('id');
  if (!id) {
    return new Response('Missing ID', { status: 400 });
  }
  return db_Provider<any>('CALL DeleteUser(?)', [id], true);
}
