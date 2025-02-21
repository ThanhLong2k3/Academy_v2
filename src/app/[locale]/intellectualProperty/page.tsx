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
import { IntellectualPropertyAPI } from '@/libs/api/IntellectualProperty.api';
import { COLUMNS } from '../../../components/UI_shared/Table';
import { IntellectualPropertyForm } from '@/components/intellectualProperty/intellectualProperty_Form';
import { IntellectualProperty_Colum } from '@/components/intellectualProperty/intellectualProperty_Table';
import { useNotification } from '../../../components/UI_shared/Notification';
import Header_Children from '@/components/UI_shared/Children_Head';
import { showDateFormat } from '@/utils/date';
import { GetDivision } from '@/models/division.model';
import { GetPosition } from '@/models/position.model';
import { PositionAPI } from '@/libs/api/position.api';
import { divisionAPI } from '@/libs/api/division.api';
import { getInforFile, uploadFilesImage } from '@/libs/api/upload.api';
import { GetIntellectualProperty } from '@/models/IntellectualProperty.model';
import { DepartmentAPI } from '@/libs/api/department.api';
import { Department_DTO } from '@/models/department.model';
const IntellectualPropertyPage = () => {
  const [IntellectualPropertys, setIntellectualPropertys] = useState<
    GetIntellectualProperty[]
  >([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingIntellectualProperty, setEditingIntellectualProperty] =
    useState<GetIntellectualProperty | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [orderType, setOrderType] = useState<'ASC' | 'DESC'>('ASC');
  const [form] = Form.useForm();
  const [total, setTotal] = useState<number>(10);
  const { show } = useNotification();
  const [departments, setDepartments] = useState<Department_DTO[]>([]);

  useEffect(() => {
    GetIntellectualPropertysByPageOrder(
      currentPage,
      pageSize,
      orderType,
      searchText,
    );
    getDepartments();
  }, [currentPage, pageSize, orderType, searchText]);

  const GetIntellectualPropertysByPageOrder = async (
    pageIndex: number,
    pageSize: number,
    orderType: 'ASC' | 'DESC',
    IntellectualPropertyName?: string,
  ) => {
    try {
      setLoading(true);
      const data =
        await IntellectualPropertyAPI.getIntellectualPropertysByPageOrder(
          pageIndex,
          pageSize,
          orderType,
          IntellectualPropertyName,
        );
      setTotal(data[0].TotalRecords);
      setIntellectualPropertys(data || []);
    } catch (error) {
      show({
        result: 1,
        messageError: 'Lỗi tải danh sách bản quyền',
      });
    } finally {
      setLoading(false);
    }
  };

  const getDepartments = async () => {
    const data = await DepartmentAPI.getDepartmentByPageOrder(1, 100, 'ASC');
    setDepartments(data);
  };
  const handleRefresh = () => {
    setSearchText('');
    GetIntellectualPropertysByPageOrder(1, pageSize, orderType);
  };

  const handleSearch = (value: string) => {
    GetIntellectualPropertysByPageOrder(1, pageSize, orderType, value);
  };

  const openCreateModal = () => {
    setEditingIntellectualProperty(null);
    setIsEditing(false);
    form.resetFields();
    setModalVisible(true);
  };

  const openEditModal = async (record: GetIntellectualProperty) => {
    debugger;
    setEditingIntellectualProperty(record);
    setIsEditing(true);

    const formattedValues = {
      ...record,
    };

    if (
      formattedValues.IntellectualPropertyImage &&
      typeof formattedValues.IntellectualPropertyImage === 'string'
    ) {
      try {
        const fileInfo = await getInforFile(
          formattedValues.IntellectualPropertyImage,
        );

        if (!fileInfo.success)
          throw new Error(fileInfo.error || 'Lỗi khi lấy thông tin file');

        formattedValues.IntellectualPropertyImage = [
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
    setEditingIntellectualProperty(null);
    setIsEditing(false);
    form.resetFields();
  };

  const handleDelete = async (record: GetIntellectualProperty) => {
    try {
      const data: any =
        await IntellectualPropertyAPI.deleteIntellectualProperty(record.Id);
      show({
        result: data.result,
        messageDone: 'Xóa bản quyền thành công',
        messageError: 'Xóa bản quyền thất bại',
      });
      GetIntellectualPropertysByPageOrder(currentPage, pageSize, orderType);
    } catch (error) {
      show({
        result: 1,
        messageError: 'Lỗi xóa bản quyền',
      });
    }
  };
  const AddIntellectualProperty = async (value: any) => {
    const result: any =
      await IntellectualPropertyAPI.createIntellectualProperty(value);
    show({
      result: result.result,
      messageDone: 'Thêm bản quyền thành công',
      messageError: 'Thêm bản quyền thất bại',
    });
  };

  const UpdateIntellectualProperty = async (Id: number, value: any) => {
    const newIntellectualProperty = {
      Id: Id,
      ...value,
    };
    const result: any =
      await IntellectualPropertyAPI.updateIntellectualProperty(
        newIntellectualProperty,
      );
    show({
      result: result.result,
      messageDone: 'Cập nhật bản quyền thành công',
      messageError: 'Cập nhật bản quyền thất bại',
    });
  };
  const handleSave = async () => {
    try {
      const values: any = await form.validateFields();
      setLoading(true);
      debugger;
      let imageUrl = '';
      if (values.IntellectualPropertyImage[0].url) {
        imageUrl = values.IntellectualPropertyImage[0].url;
      } else if (
        values.IntellectualPropertyImage &&
        values.IntellectualPropertyImage.length > 0
      ) {
        const fileObj = values.IntellectualPropertyImage[0].originFileObj;
        const uploadedPaths = await uploadFilesImage([fileObj]);
        imageUrl = uploadedPaths[0];
      }

      const dataToSubmit = {
        ...values,
        IntellectualPropertyImage: imageUrl,
      };

      if (editingIntellectualProperty) {
        await UpdateIntellectualProperty(
          editingIntellectualProperty.Id,
          dataToSubmit,
        );
      } else {
        await AddIntellectualProperty(dataToSubmit);
      }

      await GetIntellectualPropertysByPageOrder(
        currentPage,
        pageSize,
        orderType,
      );
      closeModal();
    } catch (error) {
      show({
        result: 1,
        messageError: 'Lỗi lưu bản quyền',
      });
      console.error('Lỗi chi tiết:', error);
    } finally {
      setLoading(false);
    }
  };

  const columns = COLUMNS({
    columnType: IntellectualProperty_Colum,
    openModal: openEditModal,
    handleDelete: handleDelete,
  });

  return (
    <Card className="p-6">
      <Header_Children
        title={'Quản lý bản quyền'}
        onAdd={openCreateModal}
        text_btn_add="Thêm bản quyền"
      />

      <hr />

      <div className="py-4">
        <Space size="middle">
          <Input.Search
            placeholder="Search IntellectualPropertys..."
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
          dataSource={IntellectualPropertys}
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
        title={
          editingIntellectualProperty ? 'Cập nhập bản quyền' : 'Thêm bản quyền'
        }
        open={modalVisible}
        onOk={handleSave}
        onCancel={closeModal}
        width="60%"
      >
        <IntellectualPropertyForm formData={form} departments={departments} />
      </Modal>
    </Card>
  );
};

export default IntellectualPropertyPage;
