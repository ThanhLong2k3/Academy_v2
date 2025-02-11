import type { NextRequest } from 'next/server';
import { db_Provider } from '@/app/api/Api_Provider';
import type { GetDepartment, AddDepartment } from '@/models/department.model';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const pageIndex = Number(searchParams.get('pageIndex')) || 1;
  const pageSize = Number(searchParams.get('pageSize')) || 10;
  const orderType = (searchParams.get('orderType') as 'ASC' | 'DESC') || 'ASC';
  const departmentName = searchParams.get('departmentName') || undefined;

  return GetDepartmentByPageOrder(
    pageIndex,
    pageSize,
    orderType,
    departmentName,
  );
}

export async function GetDepartmentByPageOrder(
  pageIndex: number,
  pageSize: number,
  orderType: 'ASC' | 'DESC',
  departmentName?: string,
) {
  try {
    const result = await db_Provider<GetDepartment[]>(
      'CALL GetDepartmentByPageOrder(?, ?, ?, ?)',
      [pageIndex, pageSize, orderType, departmentName || null],
    );
    console.log(result);
    return result;
  } catch (error) {
    console.error('Lỗi khi lấy danh sách đơn vị:', error);
    throw new Error('Không thể lấy danh sách đơn vị.');
  }
}

export async function POST(request: NextRequest) {
  const body: AddDepartment = await request.json();
  console.log(body);
  return db_Provider<any>(
    'CALL AddDepartment(?,?)',
    [body.DepartmentName, body.Description],
    true,
  );
}

export async function PATCH(request: NextRequest) {
  const body: GetDepartment = await request.json();
  console.log(body);
  return db_Provider<any>(
    'CALL UpdateDepartment(?,?,?)',
    [body.Id, body.DepartmentName, body.Description],
    true,
  );
}

export async function DELETE(request: NextRequest) {
  const id = request.nextUrl.searchParams.get('id');
  if (!id) {
    return new Response('Missing ID', { status: 400 });
  }
  return db_Provider<any>('CALL DeleteDepartment(?)', [id], true);
}
