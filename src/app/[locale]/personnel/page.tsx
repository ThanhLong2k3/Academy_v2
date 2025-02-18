'use client';

import { useState, useEffect } from 'react';
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Space,
  Card,
  Divider,
  message,
} from 'antd';
import {
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  SearchOutlined,
  ReloadOutlined,
} from '@ant-design/icons';
import type { Personnel_DTO, GetPersonnel_DTO } from '@/models/personnel.model';
import { PersonnelAPI } from '@/libs/api/personnel.api';
import { COLUMNS } from '../../../components/UI_shared/Table';
import { Personnel_Colum } from '../../../components/personnel/personnel_Table';
import { PersonnelForm } from '../../../components/personnel/personnel_Form';
import { useNotification } from '../../../components/UI_shared/Notification';
import Header_Children from '@/components/UI_shared/Children_Head';

const PersonnelPage = () => {
  const [personnels, setPersonnels] = useState<GetPersonnel_DTO[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingPersonnel, setEditingPersonnel] =
    useState<GetPersonnel_DTO | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [orderType, setOrderType] = useState<'ASC' | 'DESC'>('ASC');
  const [form] = Form.useForm();
  const [total, setTotal] = useState<number>(10);
  const { show } = useNotification();

  useEffect(() => {
    GetPersonnelsByPageOrder(currentPage, pageSize, orderType);
  }, [currentPage, pageSize, orderType]);

  const GetPersonnelsByPageOrder = async (
    pageIndex: number,
    pageSize: number,
    orderType: 'ASC' | 'DESC',
  ) => {
    try {
      setLoading(true);
      const data = await PersonnelAPI.getPersonnelsByPageOrder(
        pageIndex,
        pageSize,
        orderType,
      );
      console.log(data);
      setTotal(data.length);
      setPersonnels(data);
    } catch (error) {
      show({
        result: 1,
        messageError: 'Lỗi tải danh sách nhân viên',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    setSearchText('');
    GetPersonnelsByPageOrder(1, pageSize, orderType);
  };

  const handleSearch = (value: string) => {
    setSearchText(value);
    const filteredData = personnels.filter((personnel) =>
      personnel.PersonnelName?.toLowerCase().includes(value.toLowerCase()),
    );
    setPersonnels(filteredData);
  };

  const openCreateModal = () => {
    setEditingPersonnel(null);
    setIsEditing(false);
    form.resetFields();
    setModalVisible(true);
  };

  const openEditModal = (record: GetPersonnel_DTO) => {
    setEditingPersonnel(record);
    setIsEditing(true);
    form.setFieldsValue(record);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setEditingPersonnel(null);
    setIsEditing(false);
    form.resetFields();
  };

  const handleDelete = async (record: GetPersonnel_DTO) => {
    try {
      const data: any = await PersonnelAPI.deletePersonnel(record.Id);
      show({
        result: data.result,
        messageDone: 'Xóa nhân viên thành công',
        messageError: 'Xóa nhân viên thất bại',
      });
      GetPersonnelsByPageOrder(currentPage, pageSize, orderType);
    } catch (error) {
      show({
        result: 1,
        messageError: 'Lỗi xóa nhân viên',
      });
    }
  };

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);
      let result: any;
      if (editingPersonnel) {
        result = await PersonnelAPI.updatePersonnel(values); // Sử dụng FormData
        show({
          result: result.result,
          messageDone: 'Cập nhật nhân viên thành công',
          messageError: 'Cập nhật nhân viên thất bại',
        });
      } else {
        result = await PersonnelAPI.createPersonnel(values);
        show({
          result: result.result,
          messageDone: 'Thêm nhân viên thành công',
          messageError: 'Thêm nhân viên thất bại',
        });
      }

      await GetPersonnelsByPageOrder(currentPage, pageSize, orderType);
      closeModal();
    } catch (error) {
      console.error('❌ Lỗi khi lưu nhân viên:', error);
      show({
        result: 1,
        messageError: 'Lỗi lưu chức vụ',
      });
    } finally {
      setLoading(false);
    }
  };

  const columns = COLUMNS({
    columnType: Personnel_Colum,
    openModal: openEditModal,
    handleDelete: handleDelete,
  });

  return (
    <Card className="p-6">
      <Header_Children
        title={'Quản lý chức vụ'}
        onAdd={openCreateModal}
        text_btn_add="Thêm chức vụ"
      />

      <hr />

      <div className="py-4">
        <Space size="middle">
          <Input.Search
            placeholder="Search Personnels..."
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

      <div className="py-4">
        <Table
          columns={columns}
          dataSource={personnels}
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
        title={editingPersonnel ? 'Cập nhập chức vụ' : 'Thêm chức vụ'}
        open={modalVisible}
        onOk={handleSave}
        onCancel={closeModal}
        width="60%"
      >
        <PersonnelForm formdulieu={form} isEditing={isEditing} />
      </Modal>
    </Card>
  );
};

export default PersonnelPage;
