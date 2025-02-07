import { ColumnType } from '../UI_shared/ColumType';

export const Position_Colum: ColumnType[] = [
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
    title: 'Tên chức vụ',
    dataIndex: 'PositionName',
    key: 'PositionName',
    width: '80%',
  },
];
