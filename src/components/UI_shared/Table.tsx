import { Button, Space, Popconfirm, Tooltip } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import type { ColumnType } from 'antd/es/table'; // Import ColumnType

// Define the interface for props
interface ColumnProps<T> {
  columnType: ColumnType<T>[];
  openModal: (record: T) => void;
  handleDelete: (record: T) => void;
}

const createColumns = <T,>({
  columnType,
  openModal,
  handleDelete,
}: ColumnProps<T>): ColumnType<T>[] => {
  return [
    ...columnType,
    {
      title: 'Tác vụ',
      key: 'action',
      width: '150px',
      render: (_: any, record: T) => (
        <div className="flex gap-2 justify-end">
          <Button
            type="primary"
            shape="circle"
            icon={<EditOutlined />}
            className="bg-purple-600 mr-3"
            style={{marginRight:'10px'}}
            onClick={() => openModal(record)}
          />
          <Button
            shape="circle"
            icon={<DeleteOutlined />}
            className="bg-white text-red-500 border-red-500 hover:bg-red-500 hover:text-white"
            style={{backgroundColor:'red',color:'white'}}
            onClick={() => handleDelete(record)}
          />
        </div>
      ),
    },
  ];
};

export const COLUMNS = <T,>(props: ColumnProps<T>) => createColumns(props);
