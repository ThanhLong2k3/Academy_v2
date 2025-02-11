import { ColumnType } from '../UI_shared/ColumType';

export const Personnel_Colum: ColumnType[] = [
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
    title: 'Mã nhân sự',
    dataIndex: 'Id',
    key: 'Id',
    width: '10%',
  },
  {
    title: 'Tên bộ phận',
    dataIndex: 'DivisionId',
    key: 'DivisionId',
    width: '15%',
  },
  {
    title: 'Tên nhân sự',
    dataIndex: 'PersonnelName',
    key: 'PersonnelName',
    width: '20%',
  },
  {
    title: 'Chức vụ',
    dataIndex: 'PositionId',
    key: 'PositionId',
    width: '15%',
  },
  {
    title: 'Ngày sinh',
    dataIndex: 'DateOfBirth',
    key: 'DateOfBirth',
    width: '15%',
  },
  {
    title: 'Hình ảnh',
    dataIndex: 'Picture',
    key: 'Picture',
    width: '15%',
    render: (text) =>
      text ? (
        <img src={text} alt="Hình ảnh" width={50} height={50} />
      ) : (
        <span>Không có</span>
      ),
  },
  {
    title: 'Email',
    dataIndex: 'Email',
    key: 'Email',
    width: '20%',
  },
  {
    title: 'Mô tả',
    dataIndex: 'Description',
    key: 'Description',
    width: '20%',
  },
  {
    title: 'Số điện thoại',
    dataIndex: 'PhoneNumber',
    key: 'PhoneNumber',
    width: '15%',
  },
  {
    title: 'Ngày vào làm',
    dataIndex: 'JoinDate',
    key: 'JoinDate',
    width: '15%',
  },
  {
    title: 'Ngày kết thúc',
    dataIndex: 'EndDate',
    key: 'EndDate',
    width: '15%',
  },
  {
    title: 'Trạng thái công việc',
    dataIndex: 'WorkStatus',
    key: 'WorkStatus',
    width: '15%',
  },
];
