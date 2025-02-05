'use client';

import { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, Space, Card, Divider, message } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined, SearchOutlined, ReloadOutlined } from '@ant-design/icons';
import type { GetPosition } from '@/models/position.model';
import { PositionAPI } from '@/libs/api/position.api';
import { COLUMNS } from '../../../components/UI_shared/Table';
import { Position_Colum } from '../../../components/position/position_Table';
import { PositionForm } from '../../../components/position/position_Form';
import { CustomNotification } from '../../../components/UI_shared/Notification';

const PositionPage = () => {
  const [positions, setPositions] = useState<GetPosition[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingPosition, setEditingPosition] = useState<GetPosition | null>(null);
  const [isEditing, setIsDelete] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [form] = Form.useForm();

  useEffect(() => {
    GetAllPosition();
  }, []);

  const GetAllPosition = async () => {
    try {
      setLoading(true);
      const data = await PositionAPI.getAll();
      setPositions(data);
    } catch (error) {
      message.error('Lỗi tải danh sách chức vụ');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    setSearchText('');
    GetAllPosition();
  };

  const handleSearch = (value: string) => {
    setSearchText(value);
    const filteredData = positions.filter(position =>
      position.PositionName?.toLowerCase().includes(value.toLowerCase())
    );
    setPositions(filteredData);
  };

  const openModal = (record: GetPosition) => {
    setEditingPosition(record);
    form.setFieldsValue(record);
    setModalVisible(true);
    setIsDelete(true);
  };

  const handleDelete = async (record: GetPosition) => {
    try {
      await PositionAPI.delete(record.Id);
      message.success('Xóa chức vụ thành công');
      GetAllPosition();
    } catch (error) {
      message.error('Lỗi xóa chức vụ');
    }
  };

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);
      let result;
      if (editingPosition) {
        result = await PositionAPI.update(values);
        message.success('Cập nhật chức vụ thành công');
      } else {
        result = await PositionAPI.create(values);
        message.success('Thêm chức vụ thành công');
      }
      CustomNotification({
        result: typeof result === 'object' && result !== null ? (result as any).result : result,
      });
      await GetAllPosition();
      setModalVisible(false);
    } catch (error) {
      message.error('Lỗi lưu chức vụ');
    } finally {
      setLoading(false);
    }
  };

  const columns = COLUMNS({
    columnType: Position_Colum,
    openModal: openModal,
    handleDelete: handleDelete,
  });

  return (
    <Card className="p-6">
      {/* Tier 1: Title and Add Button */}
      <div className="flex items-center gap-2 text-gray-600 mb-4">
      <a href="/vi" className="hover:text-purple-600 flex items-center justify-center">
      <button type="button" className="ant-btn css-c2eqey ant-btn-default"><span role="img" aria-label="home" className="anticon anticon-home"><svg viewBox="64 64 896 896" focusable="false" data-icon="home" width="1em" height="1em" fill="currentColor" aria-hidden="true"><path d="M946.5 505L560.1 118.8l-25.9-25.9a31.5 31.5 0 00-44.4 0L77.5 505a63.9 63.9 0 00-18.8 46c.4 35.2 29.7 63.3 64.9 63.3h42.5V940h691.8V614.3h43.4c17.1 0 33.2-6.7 45.3-18.8a63.6 63.6 0 0018.7-45.3c0-17-6.7-33.1-18.8-45.2zM568 868H456V664h112v204zm217.9-325.7V868H632V640c0-22.1-17.9-40-40-40H432c-22.1 0-40 17.9-40 40v228H238.1V542.3h-96l370-369.7 23.1 23.1L882 542.3h-96.1z"></path></svg></span></button>
      </a>


        <span>/</span>
        <span>Danh mục đơn vị</span>
      </div>

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Danh mục đơn vị</h1>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          className="bg-purple-600"
          onClick={() => {
            setEditingPosition(null);
            setIsDelete(false);
            form.resetFields();
            setModalVisible(true);
          }}
        >
          Thêm đơn vị
        </Button>
      </div>

      <Divider className="my-4" />

      {/* Tier 2: Search and Refresh */}
      <div className="py-4">
        <Space size="middle">
          <Input.Search
            placeholder="Search positions..."
            allowClear
            enterButton={<SearchOutlined />}
            size="large"
            value={searchText}
            onChange={(e) => handleSearch(e.target.value)}
            style={{ width: 300 }}
          />
          <Button
            type="default"
            icon={<ReloadOutlined />}
            size="large"
            onClick={handleRefresh}
          >
            Refresh
          </Button>
        </Space>
      </div>

      <Divider className="my-4" />

      {/* Tier 3: Data Table */}
      <div className="py-4">
        <Table
          columns={columns}
          dataSource={positions}
          rowKey="Id"
          loading={loading}
          scroll={{ x: 800, y: 400 }}
          pagination={{
            total: positions.length,
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `Total ${total} items`,
          }}
        />
      </div>

      {/* Modal Form */}
      <Modal
        title={editingPosition ? 'Edit Position' : 'Add Position'}
        open={modalVisible}
        onOk={handleSave}
        onCancel={() => {
          setModalVisible(false);
          setIsDelete(false);
          form.resetFields();
        }}
      >
        <PositionForm formdulieu={form} isEditing={isEditing} />
      </Modal>
    </Card>
  );
};

export default PositionPage;