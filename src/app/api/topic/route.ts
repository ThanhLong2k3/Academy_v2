import { type NextRequest, NextResponse } from 'next/server';
import { db_Provider } from '@/app/api/Api_Provider';
import type {
  Get_Product,
  Add_Product,
  Update_Product,
} from '@/models/product.model';
import { AddTopic, UpTopic } from '@/models/topic.model';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const pageIndex = Number(searchParams.get('pageIndex')) || 1;
  const pageSize = Number(searchParams.get('pageSize')) || 10;
  const orderType = (searchParams.get('orderType') as 'ASC' | 'DESC') || 'ASC';
  const TopicName = searchParams.get('topicName') || undefined;

  return getproductByPageOrder(pageIndex, pageSize, orderType, TopicName);
}

export async function getproductByPageOrder(
  pageIndex: number,
  pageSize: number,
  orderType: 'ASC' | 'DESC',
  TopicName?: string,
) {
  try {
    return db_Provider<Get_Product[]>('CALL GetTopicsByPageOrder(?, ?, ?, ?)', [
      pageIndex,
      pageSize,
      orderType,
      TopicName || null,
    ]);
  } catch (error) {
    console.error('Lỗi khi lấy danh sách đề tài:', error);
    return NextResponse.json(
      { error: 'Không thể lấy danh sách đề tài.' },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: AddTopic = await request.json();

    const formattedEndDate = body.TopicEndDate ? body.TopicEndDate : null;

    return db_Provider<any>(
      'CALL AddTopic(?,?,?,?,?,?)',
      [
        body.TopicName,
        body.DepartmentId,
        body.TopicStartDate,
        formattedEndDate,
        body.Description,
        body.TopicStatus,
      ],
      true,
    );
  } catch (error) {
    console.error('Lỗi khi thêm đề tài:', error);
    return NextResponse.json(
      { error: 'Không thể thêm đề tài.' },
      { status: 500 },
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body: UpTopic = await request.json();
    if (!body.Id) {
      return NextResponse.json({ error: 'Thiếu ID đề tài' }, { status: 400 });
    }
    const formattedEndDate = body.TopicEndDate ? body.TopicEndDate : null;

    return db_Provider<any>(
      'CALL UpdateTopic(?,?,?,?,?,?,?)',
      [
        body.Id,
        body.TopicName,
        body.DepartmentId,
        body.TopicStartDate,
        formattedEndDate,
        body.Description,
        body.TopicStatus,
      ],
      true,
    );
  } catch (error) {
    console.error('Lỗi khi cập nhật đề tài:', error);
    return NextResponse.json(
      { error: 'Không thể cập nhật đề tài.' },
      { status: 500 },
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const id = request.nextUrl.searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'Thiếu ID đề tài' }, { status: 400 });
    }

    return db_Provider<any>('CALL DeleteTopic(?)', [id], true);
  } catch (error) {
    console.error('Lỗi khi xóa đề tài:', error);
    return NextResponse.json(
      { error: 'Không thể xóa đề tài.' },
      { status: 500 },
    );
  }
}
