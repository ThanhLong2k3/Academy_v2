import { type NextRequest, NextResponse } from 'next/server';
import { db_Provider } from '@/app/api/Api_Provider';
import type {
  Get_Product,
  Add_Product,
  Update_Product,
} from '@/models/product.model';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const pageIndex = Number(searchParams.get('pageIndex')) || 1;
  const pageSize = Number(searchParams.get('pageSize')) || 10;
  const orderType = (searchParams.get('orderType') as 'ASC' | 'DESC') || 'ASC';
  const productName = searchParams.get('productName') || undefined;

  return getproductByPageOrder(pageIndex, pageSize, orderType, productName);
}

export async function getproductByPageOrder(
  pageIndex: number,
  pageSize: number,
  orderType: 'ASC' | 'DESC',
  productName?: string,
) {
  try {
    return db_Provider<Get_Product[]>(
      'CALL GetProductsByPageOrder(?, ?, ?, ?)',
      [pageIndex, pageSize, orderType, productName || null],
    );
  } catch (error) {
    console.error('Lỗi khi lấy danh sách sản phẩm:', error);
    return NextResponse.json(
      { error: 'Không thể lấy danh sách sản phẩm.' },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: Add_Product = await request.json();

    const formattedEndDate = body.ProductEndDate ? body.ProductEndDate : null;

    return db_Provider<any>(
      'CALL AddProduct(?,?,?,?,?)',
      [
        body.ProductName,
        body.DepartmentId,
        body.ProductStartDate,
        formattedEndDate,
        body.ProductStatus,
      ],
      true,
    );
  } catch (error) {
    console.error('Lỗi khi thêm sản phẩm:', error);
    return NextResponse.json(
      { error: 'Không thể thêm sản phẩm.' },
      { status: 500 },
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body: Update_Product = await request.json();
    if (!body.Id) {
      return NextResponse.json({ error: 'Thiếu ID sản phẩm' }, { status: 400 });
    }

    const formattedEndDate = body.ProductEndDate ? body.ProductEndDate : null;

    return db_Provider<any>(
      'CALL UpdateProduct(?,?,?,?,?,?)',
      [
        body.Id,
        body.ProductName,
        body.DepartmentId,
        body.ProductStartDate,
        body.ProductEndDate,
        body.ProductStatus,
      ],
      true,
    );
  } catch (error) {
    console.error('Lỗi khi cập nhật sản phẩm:', error);
    return NextResponse.json(
      { error: 'Không thể cập nhật sản phẩm.' },
      { status: 500 },
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const id = request.nextUrl.searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'Thiếu ID sản phẩm' }, { status: 400 });
    }

    return db_Provider<any>('CALL DeleteProduct(?)', [id], true);
  } catch (error) {
    console.error('Lỗi khi xóa sản phẩm:', error);
    return NextResponse.json(
      { error: 'Không thể xóa sản phẩm.' },
      { status: 500 },
    );
  }
}
