import { type NextRequest, NextResponse } from 'next/server';
import { executeQuery } from '@/libs/db';
import { Division_DTO, GetDivision } from '@/models/division.model';
import { GetPersonnel_DTO, Personnel_DTO } from '@/models/personnel.model';
import { db_Provider } from '@/app/api/Api_Provider';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const pageIndex = Number(searchParams.get('pageIndex')) || 1;
  const pageSize = Number(searchParams.get('pageSize')) || 10;
  const orderType = (searchParams.get('orderType') as 'ASC' | 'DESC') || 'ASC';

  return getPersonnelsByPageOrder(pageIndex, pageSize, orderType);
}
export async function getPersonnelsByPageOrder(
  pageIndex: number,
  pageSize: number,
  orderType: 'ASC' | 'DESC',
) {
  try {
    const result = await db_Provider<GetPersonnel_DTO[]>(
      `CALL GetPersonnelByPageOrder(${pageIndex}, ${pageSize}, '${orderType}')`,
    );
    return result;
  } catch (error) {
    console.error('Lỗi khi lấy danh sách chức vụ:', error);
    throw new Error('Không thể lấy danh sách chức vụ.');
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: Personnel_DTO = await request.json();

    return db_Provider<any>(
      'CALL AddPersonnel(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [
        body.DivisionId,
        body.PersonnelName,
        body.PositionId,
        body.DateOfBirth,
        body.Picture,
        body.Email,
        body.Description,
        body.PhoneNumber,
        body.JoinDate || null,
        body.EndDate || null,
        body.WorkStatus,
      ],
    );
  } catch (error) {
    console.error('Lỗi khi thêm sản phẩm:', error);
    return NextResponse.json(
      { error: 'Không thể thêm sản phẩm.' },
      { status: 500 },
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body: Division_DTO = await request.json();
    await executeQuery('CALL UpdatePersonnel(?,?,?,?,@p_Result)', [
      body.Id,
      body.DivisionName,
      body.DepartmentId,
      body.Description,
    ]);

    const result: any = await executeQuery('SELECT @p_Result AS Result');

    return NextResponse.json({ result: result[0].Result }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { result: 1, error: 'Internal Server Error' },
      { status: 500 },
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const id = request.nextUrl.searchParams.get('id');
    await executeQuery('CALL DeletePersonnel(?, @p_Result)', [id]);
    const result: any = await executeQuery('SELECT @p_Result AS Result');

    return NextResponse.json({ result: result[0].Result }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { result: 1, error: 'Internal Server Error' },
      { status: 500 },
    );
  }
}
