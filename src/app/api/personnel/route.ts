import { type NextRequest, NextResponse } from 'next/server';
import { executeQuery } from '@/libs/db';
import { Division_DTO, GetDivision } from '@/models/division.model';
import { GetPersonnel_DTO, Personnel_DTO } from '@/models/personnel.model';
import { db_Provider } from '@/app/api/Api_Provider';
export async function GET() {
  try {
    const data = await executeQuery<GetPersonnel_DTO[]>('CALL GetPersonnel()');
    return NextResponse.json(data[0]);
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    );
  }
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
    const body: Division_DTO = await request.json();

    await executeQuery('CALL AddDivision(?,?,?, @p_Result)', [
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

export async function PATCH(request: NextRequest) {
  try {
    const body: Division_DTO = await request.json();
    await executeQuery('CALL UpdateDivision(?,?,?,?,@p_Result)', [
      body.Id,
      body.DivisionName,
      body.DepartmentId,
      body.Description,
    ]);
    console.log(body);
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
