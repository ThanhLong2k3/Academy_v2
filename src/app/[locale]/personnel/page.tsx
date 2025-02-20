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
  UploadFile,
} from 'antd';
import { SearchOutlined, ReloadOutlined } from '@ant-design/icons';
import type { GetPersonnel } from '@/models/persionnel.model';
import { personnelAPI } from '@/libs/api/personnel.api';
import { COLUMNS } from '../../../components/UI_shared/Table';
import { Personnel_Colum } from '@/components/personnel/personnel_Table';
import { PersonnelForm } from '@/components/personnel/personnel_Form';
import { useNotification } from '../../../components/UI_shared/Notification';
import Header_Children from '@/components/UI_shared/Children_Head';
import { showDateFormat } from '@/utils/date';
import { GetDivision } from '@/models/division.model';
import { GetPosition } from '@/models/position.model';
import { PositionAPI } from '@/libs/api/position.api';
import { divisionAPI } from '@/libs/api/division.api';
import { getInforFile, uploadFilesImage } from '@/libs/api/upload.api';
const PersonnelPage = () => {
  const [Personnels, setPersonnels] = useState<GetPersonnel[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingPersonnel, setEditingPersonnel] = useState<GetPersonnel | null>(
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
  const [divisions, setDivisions] = useState<GetDivision[]>([]);
  const [positions, setpositions] = useState<GetPosition[]>([]);

  useEffect(() => {
    GetPersonnelsByPageOrder(currentPage, pageSize, orderType, searchText);
    getDivision();
    getPosition();
  }, [currentPage, pageSize, orderType, searchText]);

  const GetPersonnelsByPageOrder = async (
    pageIndex: number,
    pageSize: number,
    orderType: 'ASC' | 'DESC',
    PersonnelName?: string,
  ) => {
    try {
      setLoading(true);
      const data = await personnelAPI.getpersonnelsByPageOrder(
        pageIndex,
        pageSize,
        orderType,
        PersonnelName,
      );
      setTotal(data[0].TotalRecords);
      setPersonnels(data || []);
    } catch (error) {
      show({
        result: 1,
        messageError: 'Lỗi tải danh sách nhân viên',
      });
    } finally {
      setLoading(false);
    }
  };

  const getPosition = async () => {
    const data = await PositionAPI.getPositionsByPageOrder(1, 100, 'ASC');
    setpositions(data);
  };

  const getDivision = async () => {
    const data = await divisionAPI.getDivisionByPageOrder(1, 100, 'ASC');
    setDivisions(data);
  };
  const handleRefresh = () => {
    setSearchText('');
    GetPersonnelsByPageOrder(1, pageSize, orderType);
  };

  const handleSearch = (value: string) => {
    GetPersonnelsByPageOrder(1, pageSize, orderType, value);
  };

  const openCreateModal = () => {
    setEditingPersonnel(null);
    setIsEditing(false);
    form.resetFields();
    setModalVisible(true);
  };

  const openEditModal = async (record: GetPersonnel) => {
    debugger;
    setEditingPersonnel(record);
    setIsEditing(true);

    const formattedValues = {
      ...record,
      JoinDate: showDateFormat(record.JoinDate),
      EndDate: showDateFormat(record.EndDate),
      DateOfBirth: showDateFormat(record.DateOfBirth),
    };

    if (
      formattedValues.Picture &&
      typeof formattedValues.Picture === 'string'
    ) {
      try {
        const fileInfo = await getInforFile(formattedValues.Picture);

        if (!fileInfo.success)
          throw new Error(fileInfo.error || 'Lỗi khi lấy thông tin file');

        formattedValues.Picture = [
          {
            uid: fileInfo.fileInfo.uid,
            name: fileInfo.fileInfo.name,
            status: 'done',
            url: fileInfo.fileInfo.url,
          },
        ];
      } catch (error) {
        console.error('Lỗi khi lấy thông tin file:', error);
      }
    }

    form.setFieldsValue(formattedValues);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setEditingPersonnel(null);
    setIsEditing(false);
    form.resetFields();
  };

  const handleDelete = async (record: GetPersonnel) => {
    try {
      const data: any = await personnelAPI.deletepersonnel(record.Id);
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
  const AddPersonnel = async (value: any) => {
    if (value.EndDate == undefined) {
      const result: any = await personnelAPI.createpersonnel(value);
      show({
        result: result.result,
        messageDone: 'Thêm nhân viên thành công',
        messageError: 'Thêm nhân viên thất bại',
      });
    }
    if (value.EndDate > value.StartDate) {
      const result: any = await personnelAPI.createpersonnel(value);
      show({
        result: result.result,
        messageDone: 'Thêm nhân viên thành công',
        messageError: 'Thêm nhân viên thất bại',
      });
    } else {
      show({
        result: 1,
        messageError: 'Ngày kết thúc phải sau ngày bắt đầu',
      });
    }
  };

  const UpdatePersonnel = async (Id: number, value: any) => {
    const newPersonnel = {
      Id: Id,
      ...value,
    };
    const result: any = await personnelAPI.updatepersonnel(newPersonnel);
    show({
      result: result.result,
      messageDone: 'Cập nhật nhân viên thành công',
      messageError: 'Cập nhật nhân viên thất bại',
    });
  };
  const handleSave = async () => {
    try {
      const values: any = await form.validateFields();
      setLoading(true);
      debugger;
      let imageUrl = '';
      if (values.Picture[0].url) {
        imageUrl = values.Picture[0].url;
      } else if (values.Picture && values.Picture.length > 0) {
        const fileObj = values.Picture[0].originFileObj;
        const uploadedPaths = await uploadFilesImage([fileObj]);
        imageUrl = uploadedPaths[0];
      }

      const dataToSubmit = {
        ...values,
        Picture: imageUrl,
      };

      if (editingPersonnel) {
        await UpdatePersonnel(editingPersonnel.Id, dataToSubmit);
      } else {
        await AddPersonnel(dataToSubmit);
      }

      await GetPersonnelsByPageOrder(currentPage, pageSize, orderType);
      closeModal();
    } catch (error) {
      show({
        result: 1,
        messageError: 'Lỗi lưu nhân viên',
      });
      console.error('Lỗi chi tiết:', error);
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
        title={'Quản lý nhân viên'}
        onAdd={openCreateModal}
        text_btn_add="Thêm nhân viên"
      />

      <hr />

      <div className="py-4">
        <Space size="middle">
          <Input.Search
            placeholder="Search Personnels..."
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
          dataSource={Personnels}
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
        title={editingPersonnel ? 'Cập nhập nhân viên' : 'Thêm nhân viên'}
        open={modalVisible}
        onOk={handleSave}
        onCancel={closeModal}
        width="60%"
      >
        <PersonnelForm
          formdata={form}
          divisions={divisions}
          positions={positions}
        />
      </Modal>
    </Card>
  );
};

export default PersonnelPage;
