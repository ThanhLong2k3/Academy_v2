import type { NextRequest } from 'next/server';
import { db_Provider } from '@/app/api/Api_Provider';
import type {
  Add_Services,
  Update_Services,
  Get_Services,
} from '@/models/services.model';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const pageIndex = Number(searchParams.get('pageIndex')) || 1;
  const pageSize = Number(searchParams.get('pageSize')) || 10;
  const orderType = (searchParams.get('orderType') as 'ASC' | 'DESC') || 'ASC';
  const ServiceName = searchParams.get('serviceName') || undefined;

  return getServicesByPageOrder(pageIndex, pageSize, orderType, ServiceName);
}

export async function getServicesByPageOrder(
  pageIndex: number,
  pageSize: number,
  orderType: 'ASC' | 'DESC',
  ServiceName?: string,
) {
  try {
    const result = await db_Provider<Get_Services[]>(
      'CALL GetServicesByPageOrder(?, ?, ?, ?)',
      [pageIndex, pageSize, orderType, ServiceName || null],
    );
    console.log(result);
    return result;
  } catch (error) {
    console.error('Lỗi khi lấy danh sách dịch vụ:', error);
    throw new Error('Không thể lấy danh sách dịch vụ.');
  }
}

export async function POST(request: NextRequest) {
  const body: Add_Services = await request.json();
  return db_Provider<any>(
    'CALL AddService(?,?,?)',
    [body.ServiceName, body.Description, body.ServiceStatus],
    true,
  );
}

export async function PATCH(request: NextRequest) {
  const body: Update_Services = await request.json();
  return db_Provider<any>(
    'CALL UpdateService(?,?,?,?)',
    [body.Id, body.ServiceName, body.Description, body.ServiceStatus],
    true,
  );
}

export async function DELETE(request: NextRequest) {
  const id = request.nextUrl.searchParams.get('id');
  if (!id) {
    return new Response('Missing ID', { status: 400 });
  }
  return db_Provider<any>('CALL DeleteService(?)', [id], true);
}
