import { ColumnType } from '../UI_shared/ColumType';

export const Customer_Colum: ColumnType[] = [
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
    title: 'Tên khách hàng',
    dataIndex: 'CustomerName',
    key: 'Id',
  },
  {
    title: 'Số điện thoại',
    dataIndex: 'PhoneNumber',
    key: 'PhoneNumber',
    align: 'center',
    width: '10%',
  },
  {
    title: 'Email',
    dataIndex: 'Email',
    key: 'Email',
  },
  {
    title: 'Địa chỉ',
    dataIndex: 'Address',
    key: 'Address',
  },
];
