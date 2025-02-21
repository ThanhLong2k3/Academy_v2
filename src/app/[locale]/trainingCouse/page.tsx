'use client';

import { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, Space, Card } from 'antd';
import { SearchOutlined, ReloadOutlined } from '@ant-design/icons';
import {
  AddTrainingCourse,
  GetTrainingCourse,
} from '@/models/trainingCourse.api';
import { trainingCouseAPI } from '@/libs/api/trainingCouse.api';
import { COLUMNS } from '../../../components/UI_shared/Table';
import { trainingCouse_Colum } from '@/components/trainingCouse/trainingCouse_Table';
import { TrainingCouseForm } from '@/components/trainingCouse/trainingCouse_Form';
import { useNotification } from '../../../components/UI_shared/Notification';
import Header_Children from '@/components/UI_shared/Children_Head';
import { GetPersonnel_DTO } from '@/models/personnel.model';
import { personnelAPI } from '@/libs/api/personnel.api';
import { GetPersonnel } from '@/models/persionnel.model';

const TrainingCousePage = () => {
  const [TrainingCouses, setTrainingCouses] = useState<GetTrainingCourse[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingTrainingCouse, setEditingTrainingCouse] =
    useState<GetTrainingCourse | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [form] = Form.useForm();
  const { show } = useNotification();
  const [total, setTotal] = useState<number>(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [orderType, setOrderType] = useState<'ASC' | 'DESC'>('ASC');
  const [persionnels, setPersionnels] = useState<GetPersonnel[]>([]);
  useEffect(() => {
    GetTrainingCousesByPageOrder(currentPage, pageSize, orderType, searchText);
    getPersonnel();
  }, [currentPage, pageSize, orderType]);

  const GetTrainingCousesByPageOrder = async (
    pageIndex: number,
    pageSize: number,
    orderType: 'ASC' | 'DESC',
    TrainingCouseName?: string,
  ) => {
    try {
      setLoading(true);
      const data = await trainingCouseAPI.gettrainingCousesByPageOrder(
        pageIndex,
        pageSize,
        orderType,
        TrainingCouseName,
      );
      setTotal(data[0].TotalRecords);
      setTrainingCouses(data);
    } catch (error) {
      show({
        result: 1,
        messageError: 'Lỗi tải danh sách phòng ban',
      });
    } finally {
      setLoading(false);
    }
  };

  const getPersonnel = async () => {
    const data = await personnelAPI.getpersonnelsByPageOrder(1, 100, 'ASC');
    setPersionnels(data);
  };
  const handleRefresh = () => {
    setSearchText('');
    GetTrainingCousesByPageOrder(1, pageSize, orderType);
  };

  const handleSearch = (value: string) => {
    GetTrainingCousesByPageOrder(1, pageSize, orderType, value);
  };

  // Modal Functions
  const openCreateModal = () => {
    setEditingTrainingCouse(null);
    setIsEditing(false);
    form.resetFields();
    setModalVisible(true);
  };

  const openEditModal = (record: GetTrainingCourse) => {
    setEditingTrainingCouse(record);
    setIsEditing(true);
    form.setFieldsValue(record);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setEditingTrainingCouse(null);
    setIsEditing(false);
    form.resetFields();
  };

  const handleDelete = async (record: GetTrainingCourse) => {
    try {
      const data: any = await trainingCouseAPI.deletetrainingCouse(record.Id);
      show({
        result: data.result,
        messageDone: 'Xóa khóa học thành công',
        messageError: 'Xóa khóa học thất bại',
      });
      GetTrainingCousesByPageOrder(currentPage, pageSize, orderType);
    } catch (error) {
      show({
        result: 1,
        messageError: 'Lỗi xóa khóa học',
      });
    }
  };
  const addTrainingCouse = async (NewTrainingCouse: AddTrainingCourse) => {
    const result: any =
      await trainingCouseAPI.createtrainingCouse(NewTrainingCouse);
    show({
      result: result.result,
      messageDone: 'Thêm khóa học thành công',
      messageError: 'Thêm khóa học thất bại',
    });
  };

  const updateTrainingCouse = async (
    Id: number,
    TrainingCouse: AddTrainingCourse,
  ) => {
    const Newvalue = {
      Id: Id,
      ...TrainingCouse,
    };
    const result: any = await trainingCouseAPI.updatetrainingCouse(Newvalue);
    show({
      result: result.result,
      messageDone: 'Cập nhật khóa học thành công',
      messageError: 'Cập nhật khóa học thất bại',
    });
  };
  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);
      editingTrainingCouse
        ? await updateTrainingCouse(editingTrainingCouse.Id, values)
        : await addTrainingCouse(values);

      await GetTrainingCousesByPageOrder(1, pageSize, orderType);
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
    columnType: trainingCouse_Colum,
    openModal: openEditModal,
    handleDelete: handleDelete,
  });

  return (
    <Card className="p-6">
      {/* Tier 1: Title and Add Button */}
      <Header_Children
        title={'Quản lý khóa học'}
        onAdd={openCreateModal}
        text_btn_add="Thêm khóa học"
      />

      <hr />

      {/* Tier 2: Search and Refresh */}
      <div className="py-4">
        <Space size="middle">
          <Input.Search
            placeholder="Search TrainingCouses..."
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
          dataSource={TrainingCouses}
          rowKey="Id"
          loading={loading}
          scroll={{ x: 800, y: 400 }}
          pagination={{
            total: total,
            pageSize: pageSize,
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
        title={editingTrainingCouse ? 'Cập nhập khóa học' : 'Thêm khóa học'}
        open={modalVisible}
        onOk={handleSave}
        onCancel={closeModal}
        width="60%"
      >
        <TrainingCouseForm formdata={form} personnels={persionnels} />
      </Modal>
    </Card>
  );
};

export default TrainingCousePage;
