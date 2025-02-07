'use client';

import { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, Space, Card } from 'antd';
import { SearchOutlined, ReloadOutlined } from '@ant-design/icons';
import { GetDepartment } from '@/models/department.model';
import { DepartmentAPI } from '@/libs/api/department.api';
import { COLUMNS } from '../../../components/UI_shared/Table';
import { DepartmentForm } from '@/components/Department/department_Form';
import { Department_Colum } from '@/components/Department/department_Table';
import { useNotification } from '../../../components/UI_shared/Notification';
import Header_Children from '@/components/UI_shared/Children_Head';

const DepartmentPage = () => {
  const [Departments, setDepartments] = useState<GetDepartment[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingDepartment, setEditingDepartment] =
    useState<GetDepartment | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [form] = Form.useForm();
  const { show } = useNotification();

  useEffect(() => {
    GetAllDepartment();
  }, []);

  const GetAllDepartment = async () => {
    try {
      setLoading(true);
      const data = await DepartmentAPI.getAllDepartment();
      setDepartments(data);
    } catch (error) {
      show({
        result: 1,
        messageError: 'Lỗi tải danh sách đơn vị',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    setSearchText('');
    GetAllDepartment();
  };

  const handleSearch = (value: string) => {
    setSearchText(value);
    const filteredData = Departments.filter((Department) =>
      Department.DepartmentName?.toLowerCase().includes(value.toLowerCase()),
    );
    setDepartments(filteredData);
  };

  // Modal Functions
  const openCreateModal = () => {
    setEditingDepartment(null);
    setIsEditing(false);
    form.resetFields();
    setModalVisible(true);
  };

  const openEditModal = (record: GetDepartment) => {
    setEditingDepartment(record);
    setIsEditing(true);
    form.setFieldsValue(record);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setEditingDepartment(null);
    setIsEditing(false);
    form.resetFields();
  };

  const handleDelete = async (record: GetDepartment) => {
    try {
      const data: any = await DepartmentAPI.deleteDepartment(record.Id);
      show({
        result: data.result,
        messageDone: 'Xóa đơn vị thành công',
        messageError: 'Xóa đơn vị thất bại',
      });
      GetAllDepartment();
    } catch (error) {
      show({
        result: 1,
        messageError: 'Lỗi xóa đơn vị',
      });
    }
  };

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);
      let result: any;

      if (editingDepartment) {
        const value = {
          Id: editingDepartment.Id,
          DepartmentName: values.DepartmentName,
          Description: values.Description,
        };
        result = await DepartmentAPI.updateDepartment(value);
        show({
          result: result.result,
          messageDone: 'Cập nhật đơn vị thành công',
          messageError: 'Cập nhật đơn vị thất bại',
        });
      } else {
        result = await DepartmentAPI.createDepartment(values);
        show({
          result: result.result,
          messageDone: 'Thêm đơn vị thành công',
          messageError: 'Thêm đơn vị thất bại',
        });
      }

      await GetAllDepartment();
      closeModal();
    } catch (error) {
      show({
        result: 1,
        messageError: 'Lỗi lưu đơn vị',
      });
    } finally {
      setLoading(false);
    }
  };

  const columns = COLUMNS({
    columnType: Department_Colum,
    openModal: openEditModal,
    handleDelete: handleDelete,
  });

  return (
    <Card className="p-6">
      {/* Tier 1: Title and Add Button */}
      <Header_Children
        title={'Quản lý đơn vị'}
        onAdd={openCreateModal}
        text_btn_add="Thêm đơn vị"
      />

      <hr />

      {/* Tier 2: Search and Refresh */}
      <div className="py-4">
        <Space size="middle">
          <Input.Search
            placeholder="Search Departments..."
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
          dataSource={Departments}
          rowKey="Id"
          loading={loading}
          scroll={{ x: 800, y: 400 }}
          pagination={{
            total: Departments.length,
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `Total ${total} items`,
          }}
        />
      </div>

      {/* Modal Form */}
      <Modal
        title={editingDepartment ? 'Cập nhập đơn vị' : 'Thêm đơn vị'}
        open={modalVisible}
        onOk={handleSave}
        onCancel={closeModal}
        width="60%"
      >
        <DepartmentForm formdulieu={form} isEditing={isEditing} />
      </Modal>
    </Card>
  );
};

export default DepartmentPage;
