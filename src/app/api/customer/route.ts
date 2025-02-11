import { type NextRequest, NextResponse } from 'next/server';
import { db_Provider } from '@/app/api/Api_Provider';
import type { GetCustomer, AddCustomer } from '@/models/customer.model';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const pageIndex = Number(searchParams.get('pageIndex')) || 1;
  const pageSize = Number(searchParams.get('pageSize')) || 10;
  const orderType = (searchParams.get('orderType') as 'ASC' | 'DESC') || 'ASC';
  const customerName = searchParams.get('customerName') || undefined;
  const phoneNumber = searchParams.get('phoneNumber') || undefined;

  return getCustomerByPageOrder(
    pageIndex,
    pageSize,
    orderType,
    customerName,
    phoneNumber,
  );
}

export async function getCustomerByPageOrder(
  pageIndex: number,
  pageSize: number,
  orderType: 'ASC' | 'DESC',
  CustomerName?: string,
  PhoneNumber?: string,
) {
  try {
    return db_Provider<GetCustomer[]>(
      'CALL GetCustomerByPageOrder(?, ?, ?, ?, ?)',
      [
        pageIndex,
        pageSize,
        orderType,
        CustomerName || null,
        PhoneNumber || null,
      ],
    );
  } catch (error) {
    console.error('Lỗi khi lấy danh sách khách hàng:', error);
    return NextResponse.json(
      { error: 'Không thể lấy danh sách khách hàng.' },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: AddCustomer = await request.json();
    if (!body.CustomerName || !body.PhoneNumber || !body.Address) {
      return NextResponse.json(
        { error: 'Thiếu thông tin bắt buộc' },
        { status: 400 },
      );
    }

    return db_Provider<any>(
      'CALL AddCustomer(?,?,?,?)',
      [body.CustomerName, body.PhoneNumber, body.Email, body.Address],
      true,
    );
  } catch (error) {
    console.error('Lỗi khi thêm khách hàng:', error);
    return NextResponse.json(
      { error: 'Không thể thêm khách hàng.' },
      { status: 500 },
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body: GetCustomer = await request.json();
    if (!body.Id) {
      return NextResponse.json(
        { error: 'Thiếu ID khách hàng' },
        { status: 400 },
      );
    }

    return db_Provider<any>(
      'CALL UpdateCustomer(?,?,?,?,?)',
      [body.Id, body.CustomerName, body.PhoneNumber, body.Email, body.Address],
      true,
    );
  } catch (error) {
    console.error('Lỗi khi cập nhật khách hàng:', error);
    return NextResponse.json(
      { error: 'Không thể cập nhật khách hàng.' },
      { status: 500 },
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const id = request.nextUrl.searchParams.get('id');
    if (!id) {
      return NextResponse.json(
        { error: 'Thiếu ID khách hàng' },
        { status: 400 },
      );
    }

    return db_Provider<any>('CALL DeleteCustomer(?)', [id], true);
  } catch (error) {
    console.error('Lỗi khi xóa khách hàng:', error);
    return NextResponse.json(
      { error: 'Không thể xóa khách hàng.' },
      { status: 500 },
    );
  }
}
