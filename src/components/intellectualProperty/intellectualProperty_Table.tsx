import { ColumnType } from '../UI_shared/ColumType';
import moment from 'moment';
import { Tag } from 'antd';
export const IntellectualProperty_Colum: ColumnType[] = [
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
    title: 'Chứng nhận',
    dataIndex: 'IntellectualPropertyImage',
    key: 'IntellectualPropertyImage',
    width: '10%',
    align: 'center',
    render: (text) =>
      text ? (
        <img src={text} alt="Hình ảnh" width={50} height={50} />
      ) : (
        <span>Không có</span>
      ),
  },
  {
    title: 'Tên bản quyền',
    dataIndex: 'IntellectualPropertyName',
    key: 'IntellectualPropertyName',
  },
  {
    title: 'Tên đơn vị',
    dataIndex: 'DepartmentName',
    key: 'DepartmentName',
  },
  {
    title: 'Mô tả',
    dataIndex: 'Description',
    key: 'Description',
  },
  {
    title: 'Trạng thái',
    dataIndex: 'IntellectualPropertyStatus',
    key: 'IntellectualPropertyStatus',
    width: '10%',
    render: (status) => (
      <Tag color={status === 'Đã được cấp' ? 'green' : 'red'}>{status}</Tag>
    ),
  },
];
