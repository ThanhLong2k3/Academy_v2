import { ColumnType } from '../UI_shared/ColumType';
import { Tag } from 'antd';

export const Services_Colum: ColumnType[] = [
  {
    title: 'STT',
    key: 'stt',
    width: '5%',
    align: 'center',
    render: (_text, _record, index) => (
      <span>{index !== undefined ? index + 1 : ''}</span>
    ),
  },
  {
    title: 'Tên dịch vụ',
    dataIndex: 'ServiceName',
    key: 'ServiceName',
  },
  {
    title: 'Mô tả',
    dataIndex: 'Description',
    key: 'Description',
  },

  {
    title: 'Trạng thái',
    dataIndex: 'ServiceStatus',
    key: 'ServiceStatus',
    render: (status) => (
      <Tag color={status === 'Đang kinh doanh' ? 'green' : 'red'}>{status}</Tag>
    ),
  },
];
