'use client';

import { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, Space, Card } from 'antd';
import { SearchOutlined, ReloadOutlined } from '@ant-design/icons';
import type { Partner_DTO } from '@/models/partners.model';
import { PartnerAPI } from '@/libs/api/partner.api';
import { COLUMNS } from '../../../components/UI_shared/Table';
import { Partner_Colum } from '@/components/partner/Partner_Table';
import { PartnerForm } from '@/components/partner/partner_Form';
import { useNotification } from '../../../components/UI_shared/Notification';
import Header_Children from '@/components/UI_shared/Children_Head';
import { showDateFormat } from '@/utils/date';
const PartnerPage = () => {
  const [Partners, setPartners] = useState<Partner_DTO[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingPartner, setEditingPartner] = useState<Partner_DTO | null>(
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
    Partner_DTOsByPageOrder(currentPage, pageSize, orderType, searchText);
  }, [currentPage, pageSize, orderType, searchText]);

  const Partner_DTOsByPageOrder = async (
    pageIndex: number,
    pageSize: number,
    orderType: 'ASC' | 'DESC',
    PartnerName?: string,
  ) => {
    try {
      setLoading(true);
      const data = await PartnerAPI.getPartnersByPageOrder(
        pageIndex,
        pageSize,
        orderType,
        PartnerName,
      );
      setTotal(data[0].TotalRecords);
      setPartners(data);
    } catch (error) {
      show({
        result: 1,
        messageError: 'Lỗi tải danh sách đối tác',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    setSearchText('');
    Partner_DTOsByPageOrder(1, pageSize, orderType);
  };

  const handleSearch = (value: string) => {
    Partner_DTOsByPageOrder(1, pageSize, orderType, value);
  };

  const openCreateModal = () => {
    setEditingPartner(null);
    setIsEditing(false);
    form.resetFields();
    setModalVisible(true);
  };

  const openEditModal = (record: Partner_DTO) => {
    setEditingPartner(record);
    setIsEditing(true);
    const formattedValues = {
      ...record,
      StartDate: showDateFormat(record.StartDate),
      EndDate: showDateFormat(record.EndDate),
    };
    form.setFieldsValue(formattedValues);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setEditingPartner(null);
    setIsEditing(false);
    form.resetFields();
  };

  const handleDelete = async (record: Partner_DTO) => {
    try {
      const data: any = await PartnerAPI.deletePartner(record.Id);
      show({
        result: data.result,
        messageDone: 'Xóa đối tác thành công',
        messageError: 'Xóa đối tác thất bại',
      });
      Partner_DTOsByPageOrder(currentPage, pageSize, orderType);
    } catch (error) {
      show({
        result: 1,
        messageError: 'Lỗi xóa đối tác',
      });
    }
  };

  const handleSave = async () => {
    try {
      const values: any = await form.validateFields();
      setLoading(true);
      let result: any;

      if (editingPartner) {
        const newPartner = {
          Id: editingPartner.Id,
          PartnerName: values.PartnerName,
          PhoneNumber: values.PhoneNumber,
          Email: values.Email,
          Address: values.Address,
          StartDate: values.StartDate,
          EndDate: values.EndDate,
          PartnershipStatus: values.PartnershipStatus,
        };
        result = await PartnerAPI.updatePartner(newPartner);
        show({
          result: result.result,
          messageDone: 'Cập nhật đối tác thành công',
          messageError: 'Cập nhật đối tác thất bại',
        });
      } else {
        if (values.EndDate > values.StartDate) {
          result = await PartnerAPI.createPartner(values);
          show({
            result: result.result,
            messageDone: 'Thêm đối tác thành công',
            messageError: 'Thêm đối tác thất bại',
          });
        } else {
          show({
            result: 1,
            messageError: 'Ngày kết thúc phải sau ngày bắt đầu',
          });
        }
      }

      await Partner_DTOsByPageOrder(currentPage, pageSize, orderType);
      closeModal();
    } catch (error) {
      show({
        result: 1,
        messageError: 'Lỗi lưu đối tác',
      });
    } finally {
      setLoading(false);
    }
  };

  const columns = COLUMNS({
    columnType: Partner_Colum,
    openModal: openEditModal,
    handleDelete: handleDelete,
  });

  return (
    <Card className="p-6">
      <Header_Children
        title={'Quản lý đối tác'}
        onAdd={openCreateModal}
        text_btn_add="Thêm đối tác"
      />

      <hr />

      <div className="py-4">
        <Space size="middle">
          <Input.Search
            placeholder="Search Partners..."
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

      <div className="py-4" style={{ marginTop: '20px' }}>
        <Table
          columns={columns}
          dataSource={Partners}
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
        title={editingPartner ? 'Cập nhập đối tác' : 'Thêm đối tác'}
        open={modalVisible}
        onOk={handleSave}
        onCancel={closeModal}
        width="60%"
      >
        <PartnerForm formdulieu={form} />
      </Modal>
    </Card>
  );
};

export default PartnerPage;
