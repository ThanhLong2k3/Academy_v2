import { ColumnType } from '../UI_shared/ColumType';

export const Division_Colum: ColumnType[] = [
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
    title: 'Tên bộ phận',
    dataIndex: 'DivisionName',
    key: 'DivisionName',
    width: '30%',
  },
  {
    title: 'Tên đơn vị',
    dataIndex: 'DepartmentName',
    key: 'DepartmentId',
    width: '30%',
  },
];
