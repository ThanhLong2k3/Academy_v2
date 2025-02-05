import { type NextRequest, NextResponse } from 'next/server';
import { executeQuery } from '@/libs/db';
import { GetDepartment,AddDepartment } from '@/models/department.model';
 
export async function GET() {
  try {
    const data = await executeQuery<GetDepartment[]>('CALL GetDepartments()');
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
    const body: AddDepartment = await request.json();

    await executeQuery('CALL AddDepartment(?,?, @p_Result)', [body.DepartmentName,body.Description]);

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
    const body: GetDepartment = await request.json();
    await executeQuery('CALL UpdateDepartment(?,?,?,@p_Result)', [
      body.Id,
      body.DepartmentName,
      body.Description
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

export async function DELETE(
  request: NextRequest
) {
  try {
    const id = request.nextUrl.searchParams.get("id");
    await executeQuery('CALL DeleteDepartment(?, @p_Result)', [id]);
    const result: any = await executeQuery('SELECT @p_Result AS Result');

    return NextResponse.json({ result: result[0].Result }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { result: 1, error: 'Internal Server Error' },
      { status: 500 },
    );
  }
}