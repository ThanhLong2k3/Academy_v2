import { ColumnType } from '../UI_shared/ColumType';
import moment from 'moment';
import { Tag } from 'antd';
export const Topic_Colum: ColumnType[] = [
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
    title: 'Tên đề tài',
    dataIndex: 'TopicName',
    key: 'TopicName',
  },
  {
    title: 'Tên đơn vị',
    dataIndex: 'DepartmentName',
    key: 'DepartmentName',
  },
  {
    title: 'Ngày bắt đầu',
    dataIndex: 'TopicStartDate',
    key: 'TopicStartDate',
    align: 'center',
    width: '10%',
    render: (text) => (
      <span>{text ? moment(text).format('DD/MM/YYYY') : ''}</span>
    ),
  },
  {
    title: 'Trạng thái',
    dataIndex: 'TopicStatus',
    key: 'TopicStatus',
    width: '10%',
    render: (status) => (
      <Tag color={status === 'Đã nghiệm thu' ? 'green' : 'red'}>{status}</Tag>
    ),
  },
];
