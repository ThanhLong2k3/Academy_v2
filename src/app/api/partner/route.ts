import { type NextRequest, NextResponse } from 'next/server';
import { executeQuery } from '@/libs/db';
import { Partner_DTO, AddPartner_DTO } from '@/models/partners.model';
import { formatDate } from '@/utils/date';
export async function GET() {
  try {
    const data = await executeQuery<Partner_DTO[]>('CALL GetPartners()');
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
    const body: AddPartner_DTO = await request.json();
    console.log(body);
    const formattedStartDate = formatDate(
      body.StartDate,
      'YYYY/MM/DD',
      'YYYY-MM-DD',
    );
    const formattedEndDate = formatDate(
      body.EndDate,
      'YYYY/MM/DD',
      'YYYY-MM-DD',
    );
    const result: any = await executeQuery('CALL AddPartner(?,?,?,?,?,?,?)', [
      body.PartnerName,
      body.PhoneNumber,
      body.Email,
      body.Address,
      formattedStartDate,
      formattedEndDate,
      body.PartnershipStatus,
    ]);

    if (result && result[0] && result[0][0] && result[0][0].result === 0) {
      return NextResponse.json({ result: 0 }, { status: 200 });
    } else {
      throw new Error('Failed to add partner');
    }
  } catch (error) {
    return NextResponse.json(
      { result: 1, error: 'Internal Server Error' },
      { status: 500 },
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body: Partner_DTO = await request.json();

    const result = await executeQuery('CALL UpdatePartner(?,?,?,?,?,?,?,?)', [
      body.Id,
      body.PartnerName,
      body.PhoneNumber,
      body.Email,
      body.Address,
      body.StartDate,
      body.EndDate,
      body.PartnershipStatus,
    ]);

    return NextResponse.json({ result: result }, { status: 200 });
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
    const result: any = await executeQuery('CALL DeletePartner(?)', [id]);

    return NextResponse.json({ result: result[0][0].result }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { result: 1, error: 'Internal Server Error' },
      { status: 500 },
    );
  }
}
