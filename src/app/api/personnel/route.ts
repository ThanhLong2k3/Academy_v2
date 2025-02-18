import { type NextRequest, NextResponse } from 'next/server';
import { executeQuery } from '@/libs/db';
import { Division_DTO, GetDivision } from '@/models/division.model';
import { GetPersonnel_DTO, Personnel_DTO } from '@/models/personnel.model';
import { db_Provider } from '@/app/api/Api_Provider';
import path from 'path';
import { writeFile } from 'fs/promises';
import { existsSync, mkdirSync } from 'fs';
import { readFile } from 'fs/promises';
import { IncomingForm } from 'formidable';
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
    const form = new IncomingForm({ multiples: false });

    // Parse FormData
    const [fields, files] = await new Promise((resolve, reject) => {
      form.parse(request, (err: any, fields: any, files: any) => {
        if (err) reject(err);
        else resolve([fields, files]);
      });
    });

    let picturePath = null;

    // Nếu có ảnh, lưu vào thư mục upload
    if (files.Picture) {
      const file = files.Picture[0];
      const ext = path.extname(file.originalFilename);
      const timestamp = Date.now();
      const fileName = `${timestamp}${ext}`;
      const uploadDir = path.join(process.cwd(), 'public', 'upload');

      await writeFile(path.join(uploadDir, fileName), await file.toBuffer());
      picturePath = `/upload/${fileName}`;
    }

    // Tạo object dữ liệu nhân viên
    const personnelData = {
      DivisionId: fields.DivisionId,
      PersonnelName: fields.PersonnelName,
      PositionId: fields.PositionId,
      DateOfBirth: fields.DateOfBirth,
      Picture: picturePath, // Lưu đường dẫn ảnh
      Email: fields.Email,
      Description: fields.Description,
      PhoneNumber: fields.PhoneNumber,
      JoinDate: fields.JoinDate || null,
      EndDate: fields.EndDate || null,
      WorkStatus: fields.WorkStatus,
    };

    // Lưu vào database
    await executeQuery('CALL AddPersonnel(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [
      personnelData.DivisionId,
      personnelData.PersonnelName,
      personnelData.PositionId,
      personnelData.DateOfBirth,
      personnelData.Picture,
      personnelData.Email,
      personnelData.Description,
      personnelData.PhoneNumber,
      personnelData.JoinDate,
      personnelData.EndDate,
      personnelData.WorkStatus,
    ]);

    return NextResponse.json(
      { message: 'Personnel added successfully' },
      { status: 200 },
    );
  } catch (error) {
    console.error('❌ Lỗi khi thêm nhân viên:', error);
    return NextResponse.json(
      { result: 1, error: 'Internal Server Error' },
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
