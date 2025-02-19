'use client';

import { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, Space, Card } from 'antd';
import { SearchOutlined, ReloadOutlined } from '@ant-design/icons';
import type { Add_Services, Get_Services } from '@/models/services.model';
import { servicesAPI } from '@/libs/api/services.api';
import { COLUMNS } from '../../../components/UI_shared/Table';
import { Services_Colum } from '@/components/services/services_Table';
import { ServicesForm } from '@/components/services/services_Form';
import { useNotification } from '../../../components/UI_shared/Notification';
import Header_Children from '@/components/UI_shared/Children_Head';

const ServicePage = () => {
  const [Services, setServices] = useState<Get_Services[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingService, setEditingService] = useState<Get_Services | null>(
    null,
  );
  const [isEditing, setIsEditing] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [orderType, setOrderType] = useState<'ASC' | 'DESC'>('ASC');
  const [form] = Form.useForm();
  const [total, setTotal] = useState<number>(10);
  const { show } = useNotification();

  useEffect(() => {
    Get_ServicessByPageOrder(currentPage, pageSize, orderType, searchText);
  }, [currentPage, pageSize, orderType]);

  const Get_ServicessByPageOrder = async (
    pageIndex: number,
    pageSize: number,
    orderType: 'ASC' | 'DESC',
    ServiceName?: string,
  ) => {
    try {
      setLoading(true);
      const data = await servicesAPI.getservicessByPageOrder(
        pageIndex,
        pageSize,
        orderType,
        ServiceName,
      );
      setTotal(data[0].TotalRecords);
      setServices(data);
    } catch (error) {
      show({
        result: 1,
        messageError: 'Lỗi tải danh sách dịch vụ',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    setSearchText('');
    Get_ServicessByPageOrder(1, pageSize, orderType);
  };

  const handleSearch = (value: string) => {
    Get_ServicessByPageOrder(1, pageSize, orderType, value);
  };

  const openCreateModal = () => {
    setEditingService(null);
    setIsEditing(false);
    form.resetFields();
    setModalVisible(true);
  };

  const openEditModal = (record: Get_Services) => {
    setEditingService(record);
    setIsEditing(true);
    form.setFieldsValue(record);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setEditingService(null);
    setIsEditing(false);
    form.resetFields();
  };

  const handleDelete = async (record: Get_Services) => {
    try {
      const data: any = await servicesAPI.deleteservices(record.Id);
      show({
        result: data.result,
        messageDone: 'Xóa dịch vụ thành công',
        messageError: 'Xóa dịch vụ thất bại',
      });
      Get_ServicessByPageOrder(currentPage, pageSize, orderType);
    } catch (error) {
      show({
        result: 1,
        messageError: 'Lỗi xóa dịch vụ',
      });
    }
  };
  const addServicess = async (newServices: Add_Services) => {
    const result: any = await servicesAPI.createservices(newServices);
    show({
      result: result.result,
      messageDone: 'Thêm dịch vụ thành công',
      messageError: 'Thêm dịch vụ thất bại',
    });
  };

  const updateservices = async (Id: number, services: Add_Services) => {
    const newvalue = {
      Id: Id,
      ...services,
    };

    const result: any = await servicesAPI.updateservices(newvalue);
    show({
      result: result.result,
      messageDone: 'Cập nhật dịch vụ thành công',
      messageError: 'Cập nhật dịch vụ thất bại',
    });
  };
  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);
      editingService
        ? await updateservices(editingService.Id, values)
        : await addServicess(values);

      await Get_ServicessByPageOrder(currentPage, pageSize, orderType);
      closeModal();
    } catch (error) {
      show({
        result: 1,
        messageError: 'Lỗi lưu dịch vụ',
      });
    } finally {
      setLoading(false);
    }
  };

  const columns = COLUMNS({
    columnType: Services_Colum,
    openModal: openEditModal,
    handleDelete: handleDelete,
  });

  return (
    <Card className="p-6">
      <Header_Children
        title={'Quản lý dịch vụ'}
        onAdd={openCreateModal}
        text_btn_add="Thêm dịch vụ"
      />

      <hr />

      <div className="py-4">
        <Space size="middle">
          <Input.Search
            placeholder="Search Services..."
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
          dataSource={Services}
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
        title={editingService ? 'Cập nhập dịch vụ' : 'Thêm dịch vụ'}
        open={modalVisible}
        onOk={handleSave}
        onCancel={closeModal}
        width="60%"
      >
        <ServicesForm formdulieu={form} />
      </Modal>
    </Card>
  );
};

export default ServicePage;
