import { ColumnType } from '../UI_shared/ColumType';

export const Department_Colum: ColumnType[] = [
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
    title: 'Tên đơn vị',
    dataIndex: 'DepartmentName',
    key: 'DepartmentName',
    width: '60%',
  },
  {
    title: 'Số bộ phận',
    dataIndex: 'TotalDivisions',
    key: 'DepartmentId',
    width: '20%',
    align: 'center',
  },
];
