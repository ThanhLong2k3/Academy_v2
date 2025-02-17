import { ColumnType } from '../UI_shared/ColumType';
import moment from 'moment';
import { Tag } from 'antd';

export const Project_Colum: ColumnType[] = [
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
    title: 'Tên dự án',
    dataIndex: 'ProjectName',
    key: 'Id',
  },
  {
    title: 'Tên đơn vị',
    dataIndex: 'DepartmentName',
    key: 'DepartmentId',
  },
  {
    title: 'Tên đối tác',
    dataIndex: 'PartnerName',
    key: 'PartnerId',
  },
  {
    title: 'Mô tả',
    dataIndex: 'Description',
    key: 'Description',
  },
  {
    title: 'Ngày bắt đầu',
    dataIndex: 'ProjectStartDate',
    key: 'ProjectStartDate',
    align: 'center',
    width: '10%',
    render: (text) => (
      <span>{text ? moment(text).format('DD/MM/YYYY') : ''}</span>
    ),
  },
  {
    title: 'Trạng thái',
    dataIndex: 'ProjectStatus',
    key: 'ProjectStatus',
    width: '10%',
    render: (status) => (
      <Tag color={status === 'Đang thực hiện' ? 'green' : 'red'}>{status}</Tag>
    ),
  },
];
