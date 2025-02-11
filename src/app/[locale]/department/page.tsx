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
  const [total, setTotal] = useState<number>(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [orderType, setOrderType] = useState<'ASC' | 'DESC'>('ASC');

  useEffect(() => {
    GetDepartmentsByPageOrder(currentPage, pageSize, orderType, searchText);
  }, [currentPage, pageSize, orderType]);

  const GetDepartmentsByPageOrder = async (
    pageIndex: number,
    pageSize: number,
    orderType: 'ASC' | 'DESC',
    departmentName?: string,
  ) => {
    try {
      setLoading(true);
      const data = await DepartmentAPI.getDepartmentByPageOrder(
        pageIndex,
        pageSize,
        orderType,
        departmentName,
      );
      setTotal(data[0].TotalRecords);
      setDepartments(data);
    } catch (error) {
      show({
        result: 1,
        messageError: 'Lỗi tải danh sách phòng ban',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    setSearchText('');
    GetDepartmentsByPageOrder(1, pageSize, orderType);
  };

  const handleSearch = (value: string) => {
    GetDepartmentsByPageOrder(1, pageSize, orderType, value);
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
      GetDepartmentsByPageOrder(currentPage, pageSize, orderType);
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
        const Newvalue = {
          Id: editingDepartment.Id,
          DepartmentName: values.DepartmentName,
          Description: values.Description,
          TotalRecords: total + 1,
        };
        result = await DepartmentAPI.updateDepartment(Newvalue);
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

      await GetDepartmentsByPageOrder(
        currentPage,
        pageSize,
        orderType,
        searchText,
      );
      closeModal();
    } catch (error) {
      show({
        result: 1,
        messageError: 'Lỗi lưu phòng ban',
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
            onSearch={handleSearch}
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
            total: total,
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `Total ${total} items`,
            onChange: (page, size) => {
              setCurrentPage(page);
              setPageSize(size);
            },
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
