import { ColumnType } from '../UI_shared/ColumType';
import moment from 'moment';
import { Tag } from 'antd';
export const Product_Colum: ColumnType[] = [
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
    title: 'Tên sản phẩm',
    dataIndex: 'ProductName',
    key: 'ProductName',
  },
  {
    title: 'Tên đơn vị',
    dataIndex: 'DepartmentName',
    key: 'DepartmentName',
  },
  {
    title: 'Ngày bắt đầu',
    dataIndex: 'ProductStartDate',
    key: 'ProductStartDate',
    align: 'center',
    width: '10%',
    render: (text) => (
      <span>{text ? moment(text).format('DD/MM/YYYY') : ''}</span>
    ),
  },
  {
    title: 'Trạng thái',
    dataIndex: 'ProductStatus',
    key: 'ProductStatus',
    width: '10%',
    render: (status) => (
      <Tag color={status === 'Đã hoàn thành' ? 'green' : 'red'}>{status}</Tag>
    ),
  },
];
