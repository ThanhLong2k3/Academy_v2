import { GetPosition, AddPoistion } from './../../../models/position.model';
import { type NextRequest, NextResponse } from 'next/server';
import { executeQuery } from '@/libs/db';

export async function GET() {
  try {
    const positions = await executeQuery<GetPosition[]>('CALL GetPositions()');
    return NextResponse.json(positions[0]);
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    );
  }
}



export async function POST(request: NextRequest) {
  try {
    const body: AddPoistion = await request.json();

    await executeQuery('CALL AddPosition(?, @p_Result)', [body.PositionName]);

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
    const body: GetPosition = await request.json();

    await executeQuery('CALL UpdatePosition(?,?,@p_Result)', [
      body.Id,
      body.PositionName,
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
    await executeQuery('CALL DeletePosition(?, @p_Result)', [id]);
    const result: any = await executeQuery('SELECT @p_Result AS Result');

    return NextResponse.json({ result: result[0].Result }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { result: 1, error: 'Internal Server Error' },
      { status: 500 },
    );
  }
}
