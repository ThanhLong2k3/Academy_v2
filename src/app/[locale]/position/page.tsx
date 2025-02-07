'use client';

import { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, Space, Card } from 'antd';
import { SearchOutlined, ReloadOutlined } from '@ant-design/icons';
import type { GetPosition } from '@/models/position.model';
import { PositionAPI } from '@/libs/api/position.api';
import { COLUMNS } from '../../../components/UI_shared/Table';
import { Position_Colum } from '../../../components/position/position_Table';
import { PositionForm } from '../../../components/position/position_Form';
import { useNotification } from '../../../components/UI_shared/Notification';
import Header_Children from '@/components/UI_shared/Children_Head';

const PositionPage = () => {
  const [positions, setPositions] = useState<GetPosition[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingPosition, setEditingPosition] = useState<GetPosition | null>(
    null,
  );
  const [isEditing, setIsEditing] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [form] = Form.useForm();
  const { show } = useNotification();

  useEffect(() => {
    GetAllPosition();
  }, []);

  const GetAllPosition = async () => {
    try {
      setLoading(true);
      const data = await PositionAPI.getAllPosition();
      setPositions(data);
    } catch (error) {
      show({
        result: 1,
        messageError: 'Lỗi tải danh sách chức vụ',
      });
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
    const filteredData = positions.filter((position) =>
      position.PositionName?.toLowerCase().includes(value.toLowerCase()),
    );
    setPositions(filteredData);
  };

  // Modal Functions
  const openCreateModal = () => {
    setEditingPosition(null);
    setIsEditing(false);
    form.resetFields();
    setModalVisible(true);
  };

  const openEditModal = (record: GetPosition) => {
    setEditingPosition(record);
    setIsEditing(true);
    form.setFieldsValue(record);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setEditingPosition(null);
    setIsEditing(false);
    form.resetFields();
  };

  const handleDelete = async (record: GetPosition) => {
    try {
      const data: any = await PositionAPI.deletePosition(record.Id);
      show({
        result: data.result,
        messageDone: 'Xóa chức vụ thành công',
        messageError: 'Xóa chức vụ thất bại',
      });
      GetAllPosition();
    } catch (error) {
      show({
        result: 1,
        messageError: 'Lỗi xóa chức vụ',
      });
    }
  };

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);
      let result: any;

      if (editingPosition) {
        result = await PositionAPI.updatePosition(values);
        show({
          result: result.result,
          messageDone: 'Cập nhật chức vụ thành công',
          messageError: 'Cập nhật chức vụ thất bại',
        });
      } else {
        result = await PositionAPI.createPosition(values);
        show({
          result: result.result,
          messageDone: 'Thêm chức vụ thành công',
          messageError: 'Thêm chức vụ thất bại',
        });
      }

      await GetAllPosition();
      closeModal();
    } catch (error) {
      show({
        result: 1,
        messageError: 'Lỗi lưu chức vụ',
      });
    } finally {
      setLoading(false);
    }
  };

  const columns = COLUMNS({
    columnType: Position_Colum,
    openModal: openEditModal,
    handleDelete: handleDelete,
  });

  return (
    <Card className="p-6">
      {/* Tier 1: Title and Add Button */}
      <Header_Children
        title={'Quản lý chức vụ'}
        onAdd={openCreateModal}
        text_btn_add="Thêm chức vụ"
      />

      <hr />

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
        title={editingPosition ? 'Cập nhập chức vụ' : 'Thêm chức vụ'}
        open={modalVisible}
        onOk={handleSave}
        onCancel={closeModal}
        width="60%"
      >
        <PositionForm formdulieu={form} isEditing={isEditing} />
      </Modal>
    </Card>
  );
};

export default PositionPage;
