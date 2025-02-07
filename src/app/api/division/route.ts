import type { NextRequest } from 'next/server';
import { db_Provider } from '@/app/api/Api_Provider';
import type { GetDivision, Division_DTO } from '@/models/division.model';
export async function GET() {
  return db_Provider<GetDivision[]>('CALL GetDivision()');
}

export async function POST(request: NextRequest) {
  const body: Division_DTO = await request.json();
  return db_Provider<any>(
    'CALL AddDivision(?,?,?)',
    [body.DivisionName, body.DepartmentId, body.Description],
    true,
  );
}

export async function PATCH(request: NextRequest) {
  const body: Division_DTO = await request.json();
  return db_Provider<any>(
    'CALL UpdateDivision(?,?,?,?)',
    [body.Id, body.DivisionName, body.DepartmentId, body.Description],
    true,
  );
}

export async function DELETE(request: NextRequest) {
  const id = request.nextUrl.searchParams.get('id');
  if (!id) {
    return new Response('Missing ID', { status: 400 });
  }
  return db_Provider<any>('CALL DeleteDivision(?)', [id], true);
}
