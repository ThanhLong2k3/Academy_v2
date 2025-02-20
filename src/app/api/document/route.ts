import type { NextRequest } from 'next/server';
import { db_Provider } from '@/app/api/Api_Provider';
import { Add_Document_DTO, Up_Document_DTO } from '@/models/document.model';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const RelatedId = Number(searchParams.get('relatedId'));
  const RelatedType = searchParams.get('relatedType') || undefined;
  console.log(searchParams);
  return getDocuments_by_IdRelated(RelatedId, RelatedType);
}

export async function getDocuments_by_IdRelated(
  relatedId: number,
  relatedType: string | undefined,
) {
  try {
    const result = await db_Provider<Up_Document_DTO[]>(
      'CALL GetDocuments_by_IdRelated(?,?)',
      [relatedId, relatedType],
    );
    return result;
  } catch (error) {
    console.error('Lỗi khi lấy danh sách tài liệu:', error);
    throw new Error('Không thể lấy danh sách tài liệu.');
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
