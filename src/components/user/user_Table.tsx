import moment from 'moment';
import { ColumnType } from '../UI_shared/ColumType';

export const User_Colum: ColumnType[] = [
  {
    title: 'Số thứ tự',
    key: 'stt',
    width: '10%',
    align: 'center',
    render: (_text, _record, index) => (
      <span>{index !== undefined ? index + 1 : ''}</span>
    ),
  },
  {
    title: 'Tên người dùng',
    dataIndex: 'FullName',
    key: 'FullName',
  },
  {
    title: 'Email',
    dataIndex: 'Email',
    key: 'Email',
  },
  {
    title: 'Vai trò',
    dataIndex: 'Role',
    key: 'Role',
  },
  {
    title: 'Ngày tạo',
    dataIndex: 'created_at',
    key: 'created_at',
    render: (text) => (
      <span>{text ? moment(text).format('DD/MM/YYYY') : ''}</span>
    ),
  },
];
