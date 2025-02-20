import { type NextRequest, NextResponse } from 'next/server';
import { db_Provider } from '@/app/api/Api_Provider';
import type {
  AddPersonnel,
  UpPersonnel,
  GetPersonnel,
} from '@/models/persionnel.model';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const pageIndex = Number(searchParams.get('pageIndex')) || 1;
  const pageSize = Number(searchParams.get('pageSize')) || 10;
  const orderType = (searchParams.get('orderType') as 'ASC' | 'DESC') || 'ASC';
  const PersonnelName = searchParams.get('personnelName') || undefined;

  return getPersonnelByPageOrder(pageIndex, pageSize, orderType, PersonnelName);
}

export async function getPersonnelByPageOrder(
  pageIndex: number,
  pageSize: number,
  orderType: 'ASC' | 'DESC',
  PersonnelName?: string,
) {
  try {
    return db_Provider<GetPersonnel[]>(
      'CALL GetPersonnelByPageOrder(?, ?, ?, ?)',
      [pageIndex, pageSize, orderType, PersonnelName || null],
    );
  } catch (error) {
    console.error('Lỗi khi lấy danh sách nhân viên:', error);
    return NextResponse.json(
      { error: 'Không thể lấy danh sách nhân viên.' },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: AddPersonnel = await request.json();

    const formattedEndDate = body.EndDate ? body.EndDate : null;
    const formattedDateOfBirth = body.DateOfBirth ? body.DateOfBirth : null;
    const formattedJoinDate = body.JoinDate ? body.JoinDate : null;

    return db_Provider<any>(
      'CALL AddPersonnel(?,?,?,?,?,?,?,?,?,?,?)',
      [
        body.DivisionId,
        body.PersonnelName,
        body.PositionId,
        formattedDateOfBirth,
        body.Picture,
        body.Email,
        body.Description,
        body.PhoneNumber,
        formattedJoinDate,
        formattedEndDate,
        body.WorkStatus,
      ],
      true,
    );
  } catch (error) {
    console.error('Lỗi khi thêm nhân viên:', error);
    return NextResponse.json(
      { error: 'Không thể thêm nhân viên.' },
      { status: 500 },
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body: UpPersonnel = await request.json();
    if (!body.Id) {
      return NextResponse.json(
        { error: 'Thiếu ID nhân viên' },
        { status: 400 },
      );
    }

    const formattedEndDate = body.EndDate ? body.EndDate : null;
    const formattedDateOfBirth = body.DateOfBirth ? body.DateOfBirth : null;
    const formattedJoinDate = body.JoinDate ? body.JoinDate : null;

    return db_Provider<any>(
      'CALL UpdatePersonnel(?,?,?,?,?,?,?,?,?,?,?,?)',
      [
        body.Id,
        body.DivisionId,
        body.PersonnelName,
        body.PositionId,
        formattedDateOfBirth,
        body.Picture,
        body.Email,
        body.Description,
        body.PhoneNumber,
        formattedJoinDate,
        formattedEndDate,
        body.WorkStatus,
      ],
      true,
    );
  } catch (error) {
    console.error('Lỗi khi cập nhật nhân viên:', error);
    return NextResponse.json(
      { error: 'Không thể cập nhật nhân viên.' },
      { status: 500 },
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const id = request.nextUrl.searchParams.get('id');
    if (!id) {
      return NextResponse.json(
        { error: 'Thiếu ID nhân viên' },
        { status: 400 },
      );
    }

    return db_Provider<any>('CALL DeletePersonnel(?)', [id], true);
  } catch (error) {
    console.error('Lỗi khi xóa nhân viên:', error);
    return NextResponse.json(
      { error: 'Không thể xóa nhân viên.' },
      { status: 500 },
    );
  }
}
