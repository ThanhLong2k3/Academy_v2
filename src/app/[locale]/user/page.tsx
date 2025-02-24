'use client';

import { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, Space, Card } from 'antd';
import { SearchOutlined, ReloadOutlined } from '@ant-design/icons';
import { GetUser, AddUser } from '@/models/user.model';
import { userAPI } from '@/libs/api/user.api';
import { COLUMNS } from '../../../components/UI_shared/Table';
import { User_Colum } from '@/components/user/user_Table';
import { UserForm } from '@/components/user/user_Form';
import { useNotification } from '../../../components/UI_shared/Notification';
import Header_Children from '@/components/UI_shared/Children_Head';
const UserPage = () => {
  const [Users, setUsers] = useState<GetUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingUser, setEditingUser] = useState<GetUser | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [orderType, setOrderType] = useState<'ASC' | 'DESC'>('ASC');
  const [form] = Form.useForm();
  const [total, setTotal] = useState<number>(10);
  const { show } = useNotification();

  useEffect(() => {
    GetUsersByPageOrder(currentPage, pageSize, orderType, searchText);
  }, [currentPage, pageSize, orderType, searchText]);

  const GetUsersByPageOrder = async (
    pageIndex: number,
    pageSize: number,
    orderType: 'ASC' | 'DESC',
    UserName?: string,
  ) => {
    try {
      setLoading(true);
      const data = await userAPI.GetUsersByPageOrder(
        pageIndex,
        pageSize,
        orderType,
        UserName,
      );
      setTotal(data[0].TotalRecords);
      setUsers(data);
    } catch (error) {
      show({
        result: 1,
        messageError: 'Lỗi tải danh sách người dùng',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    setSearchText('');
    GetUsersByPageOrder(1, pageSize, orderType);
  };

  const handleSearch = (value: string) => {
    GetUsersByPageOrder(1, pageSize, orderType, value);
  };

  const openCreateModal = () => {
    setEditingUser(null);
    setIsEditing(false);
    form.resetFields();
    setModalVisible(true);
  };

  const openEditModal = (record: GetUser) => {
    setEditingUser(record);
    setIsEditing(true);
    form.setFieldsValue(record);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setEditingUser(null);
    setIsEditing(false);
    form.resetFields();
  };

  const handleDelete = async (record: GetUser) => {
    try {
      const data: any = await userAPI.deleteuser(record.Id);
      show({
        result: data.result,
        messageDone: 'Xóa người dùng thành công',
        messageError: 'Xóa người dùng thất bại',
      });
      GetUsersByPageOrder(currentPage, pageSize, orderType);
    } catch (error) {
      show({
        result: 1,
        messageError: 'Lỗi xóa người dùng',
      });
    }
  };
  const AddUser = async (newUser: any) => {
    const result: any = await userAPI.createuser(newUser);
    show({
      result: result.result,
      messageDone: 'Thêm người dùng thành công',
      messageError: 'Thêm người dùng thất bại',
    });
  };

  const UpdateUser = async (User: AddUser) => {
    if (editingUser) {
      const newUser = {
        Id: editingUser.Id,
        FullName: User.FullName,
        Password: User.Password,
        Email: User.Email,
        Role: User.Role,
      };
      const result: any = await userAPI.updateuser(newUser);
      show({
        result: result.result,
        messageDone: 'Cập nhật người dùng thành công',
        messageError: 'Cập nhật người dùng thất bại',
      });
    }
  };
  const handleSave = async () => {
    try {
      const values: any = await form.validateFields();
      setLoading(true);

      editingUser ? await UpdateUser(values) : await AddUser(values);

      await GetUsersByPageOrder(currentPage, pageSize, orderType);
      closeModal();
    } catch (error) {
      show({
        result: 1,
        messageError: 'Lỗi lưu người dùng',
      });
    } finally {
      setLoading(false);
    }
  };

  const columns = COLUMNS({
    columnType: User_Colum,
    openModal: openEditModal,
    handleDelete: handleDelete,
  });

  return (
    <Card className="p-6">
      <Header_Children
        title={'Quản lý người dùng'}
        onAdd={openCreateModal}
        text_btn_add="Thêm người dùng"
      />

      <hr />

      <div className="py-4">
        <Space size="middle">
          <Input.Search
            placeholder="Search fullname..."
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

      <div className="py-4">
        <Table
          columns={columns}
          dataSource={Users}
          rowKey="Id"
          loading={loading}
          scroll={{ x: 800, y: 400 }}
          pagination={{
            current: currentPage,
            pageSize: pageSize,
            total: total,
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

      <Modal
        title={editingUser ? 'Cập nhập người dùng' : 'Thêm người dùng'}
        open={modalVisible}
        onOk={handleSave}
        onCancel={closeModal}
        width="60%"
      >
        <UserForm formdulieu={form} />
      </Modal>
    </Card>
  );
};

export default UserPage;
