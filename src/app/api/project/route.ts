import { type NextRequest, NextResponse } from 'next/server';
import { db_Provider } from '@/app/api/Api_Provider';
import type {
  Add_project,
  Get_project,
  Up_project,
} from '@/models/project.model';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const pageIndex = Number(searchParams.get('pageIndex')) || 1;
  const pageSize = Number(searchParams.get('pageSize')) || 10;
  const orderType = (searchParams.get('orderType') as 'ASC' | 'DESC') || 'ASC';
  const projectName = searchParams.get('projectName') || undefined;

  return GetProjectByPageOrder(pageIndex, pageSize, orderType, projectName);
}

export async function GetProjectByPageOrder(
  pageIndex: number,
  pageSize: number,
  orderType: 'ASC' | 'DESC',
  projectName?: string,
) {
  try {
    return db_Provider<Get_project[]>(
      'CALL GetProjectByPageOrder(?, ?, ?, ?)',
      [pageIndex, pageSize, orderType, projectName || null],
    );
  } catch (error) {
    console.error('Lỗi khi lấy danh sách dự án:', error);
    return NextResponse.json(
      { error: 'Không thể lấy danh sách dự án.' },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: Add_project = await request.json();

    const formattedEndDate = body.ProjectEndDate ? body.ProjectEndDate : null;
    console.log(body);
    return db_Provider<any>(
      'CALL AddProject(?,?,?,?,?,?,?)',
      [
        body.ProjectName,
        body.DepartmentId,
        body.PartnerId,
        body.Description,
        body.ProjectStartDate,
        formattedEndDate,
        body.ProjectStatus,
      ],
      true,
    );
  } catch (error) {
    console.error('Lỗi khi thêm dự án:', error);
    return NextResponse.json(
      { error: 'Không thể thêm dự án.' },
      { status: 500 },
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body: Up_project = await request.json();
    if (!body.Id) {
      return NextResponse.json({ error: 'Thiếu ID dự án' }, { status: 400 });
    }

    const formattedEndDate = body.ProjectEndDate ? body.ProjectEndDate : null;

    return db_Provider<any>(
      'CALL UpdateProject(?,?,?,?,?,?,?,?)',
      [
        body.Id,
        body.ProjectName,
        body.DepartmentId,
        body.PartnerId,
        body.Description,
        body.ProjectStartDate,
        formattedEndDate,
        body.ProjectStatus,
      ],
      true,
    );
  } catch (error) {
    console.error('Lỗi khi cập nhật dự án:', error);
    return NextResponse.json(
      { error: 'Không thể cập nhật dự án.' },
      { status: 500 },
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const id = request.nextUrl.searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'Thiếu ID dự án' }, { status: 400 });
    }

    return db_Provider<any>('CALL DeleteProject(?)', [id], true);
  } catch (error) {
    console.error('Lỗi khi xóa dự án:', error);
    return NextResponse.json(
      { error: 'Không thể xóa dự án.' },
      { status: 500 },
    );
  }
}
