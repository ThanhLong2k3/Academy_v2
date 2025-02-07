import type { NextRequest } from 'next/server';
import { db_Provider } from '@/app/api/Api_Provider';
import type { GetPosition, AddPosistion } from '@/models/position.model';
import type { GetDepartment, AddDepartment } from '@/models/department.model';
export async function GET() {
  return db_Provider<GetDepartment[]>('CALL GetDepartment()');
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
