import moment from 'moment';
import { ColumnType } from '../UI_shared/ColumType';
import { Tag } from 'antd';

export const Personnel_Colum: ColumnType[] = [
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
    title: 'Hình ảnh',
    dataIndex: 'Picture',
    key: 'Picture',
    render: (text) =>
      text ? (
        <img src={text} alt="Hình ảnh" width={50} height={50} />
      ) : (
        <span>Không có</span>
      ),
  },
  {
    title: 'Tên nhân sự',
    dataIndex: 'PersonnelName',
    key: 'PersonnelName',
  },
  {
    title: 'Tên bộ phận',
    dataIndex: 'DivisionName',
    key: 'DivisionName',
  },

  {
    title: 'Chức vụ',
    dataIndex: 'PositionName',
    key: 'PositionName',
  },
  {
    title: 'Ngày sinh',
    dataIndex: 'DateOfBirth',
    key: 'DateOfBirth',
    render: (text) => (
      <span>{text ? moment(text).format('DD/MM/YYYY') : ''}</span>
    ),
  },

  {
    title: 'Email',
    dataIndex: 'Email',
    key: 'Email',
  },
  {
    title: 'Số điện thoại',
    dataIndex: 'PhoneNumber',
    key: 'PhoneNumber',
  },
  {
    title: 'Ngày vào làm',
    dataIndex: 'JoinDate',
    key: 'JoinDate',
    render: (text) => (
      <span>{text ? moment(text).format('DD/MM/YYYY') : ''}</span>
    ),
  },
  {
    title: 'Trạng thái công việc',
    dataIndex: 'WorkStatus',
    key: 'WorkStatus',
    render: (status) => (
      <Tag color={status === 'Đang làm việc' ? 'green' : 'red'}>{status}</Tag>
    ),
  },
];
