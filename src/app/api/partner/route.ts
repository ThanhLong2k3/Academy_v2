import { type NextRequest, NextResponse } from 'next/server';
import { db_Provider } from '@/app/api/Api_Provider';
import type { Partner_DTO, AddPartner_DTO } from '@/models/partners.model';
import { formatDate } from '@/utils/date';

export async function GET() {
  return db_Provider<Partner_DTO[]>('CALL GetPartners()');
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
    const result = await db_Provider<any>(
      'CALL AddPartner(?,?,?,?,?,?,?)',
      [
        body.PartnerName,
        body.PhoneNumber,
        body.Email,
        body.Address,
        formattedStartDate,
        formattedEndDate,
        body.PartnershipStatus,
      ],
      true,
    );

    if (result.status === 200 && result.json) {
      const jsonResult = await result.json();
      if (jsonResult.result === 0) {
        return result;
      }
    }
    throw new Error('Failed to add partner');
  } catch (error) {
    console.error('Error in POST:', error);
    return NextResponse.json(
      { result: 1, error: 'Internal Server Error' },
      { status: 500 },
    );
  }
}

export async function PATCH(request: NextRequest) {
  const body: Partner_DTO = await request.json();
  return db_Provider<any>(
    'CALL UpdatePartner(?,?,?,?,?,?,?,?)',
    [
      body.Id,
      body.PartnerName,
      body.PhoneNumber,
      body.Email,
      body.Address,
      body.StartDate,
      body.EndDate,
      body.PartnershipStatus,
    ],
    true,
  );
}

export async function DELETE(request: NextRequest) {
  const id = request.nextUrl.searchParams.get('id');
  return db_Provider<any>('CALL DeletePartner(?)', [id], true);
}
