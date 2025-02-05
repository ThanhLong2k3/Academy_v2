import { type NextRequest, NextResponse } from 'next/server';
import { executeQuery } from '@/libs/db';
import { Division_DTO,GetDivision } from '@/models/division.model';
export async function GET() {
  try {
    const data = await executeQuery<GetDivision[]>('CALL GetDivisions()');
    return NextResponse.json(data[0]);
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    );
  }
}


export async function POST(request: NextRequest) {
  try {
    const body: Division_DTO = await request.json();

    await executeQuery('CALL AddDivision(?,?,?, @p_Result)', [body.DivisionName,body.DepartmentId,body.Description]);

    const result: any = await executeQuery('SELECT @p_Result AS Result');

    return NextResponse.json({ result: result[0].Result }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { result: 1, error: 'Internal Server Error' },
      { status: 500 },
    );
  }
}

export async function PATCH(
  request: NextRequest,
) {
  try {
    const body: Division_DTO = await request.json();
    await executeQuery('CALL UpdateDivision(?,?,?,?,@p_Result)', [
      body.Id,
      body.DivisionName,
      body.DepartmentId,
      body.Description
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

export async function DELETE(
  request: NextRequest
) {
  try {
    const id = request.nextUrl.searchParams.get("id");
    await executeQuery('CALL DeleteDivision(?, @p_Result)', [id]);
    const result: any = await executeQuery('SELECT @p_Result AS Result');

    return NextResponse.json({ result: result[0].Result }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { result: 1, error: 'Internal Server Error' },
      { status: 500 },
    );
  }
}