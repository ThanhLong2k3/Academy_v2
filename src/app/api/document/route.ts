import type { NextRequest } from 'next/server';
import { db_Provider } from '@/app/api/Api_Provider';
import { Add_Document_DTO, Up_Document_DTO } from '@/models/document.model';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const pageIndex = Number(searchParams.get('pageIndex')) || 1;
  const pageSize = Number(searchParams.get('pageSize')) || 10;
  const orderType = (searchParams.get('orderType') as 'ASC' | 'DESC') || 'ASC';
  const divisionName = searchParams.get('divisionName') || undefined;
  const departmentName = searchParams.get('departmentName') || undefined;

  return getDivisionByPageOrder(
    pageIndex,
    pageSize,
    orderType,
    divisionName,
    departmentName,
  );
}

export async function getDivisionByPageOrder(
  pageIndex: number,
  pageSize: number,
  orderType: 'ASC' | 'DESC',
  divisionName?: string,
  departmentName?: string,
) {
  try {
    const result = await db_Provider<Up_Document_DTO[]>(
      'CALL GetDivisionByPageOrder(?, ?, ?, ?, ?)',
      [
        pageIndex,
        pageSize,
        orderType,
        divisionName || null,
        departmentName || null,
      ],
    );
    return result;
  } catch (error) {
    console.error('Lỗi khi lấy danh sách bộ phận:', error);
    throw new Error('Không thể lấy danh sách bộ phận.');
  }
}

export async function POST(request: NextRequest) {
  const body: Add_Document_DTO = await request.json();
  return db_Provider<any>(
    'CALL AddDocument(?,?,?,?)',
    [body.DocumentName, body.DocumentLink, body.RelatedId, body.RelatedType],
    true,
  );
}

export async function PATCH(request: NextRequest) {
  const body: Up_Document_DTO = await request.json();
  return db_Provider<any>(
    'CALL UpdateDocument(?,?,?,?,?)',
    [
      body.Id,
      body.DocumentName,
      body.DocumentLink,
      body.RelatedId,
      body.RelatedType,
    ],
    true,
  );
}

export async function DELETE(request: NextRequest) {
  const id = request.nextUrl.searchParams.get('id');
  if (!id) {
    return new Response('Missing ID', { status: 400 });
  }
  return db_Provider<any>('CALL DeleteDocument(?)', [id], true);
}
