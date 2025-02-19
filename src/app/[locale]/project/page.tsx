'use client';

import { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, Space, Card } from 'antd';
import { SearchOutlined, ReloadOutlined } from '@ant-design/icons';
import type {
  Get_project,
  Up_project,
  Add_project,
} from '@/models/project.model';
import { projectAPI } from '@/libs/api/project.api';
import { COLUMNS } from '../../../components/UI_shared/Table';
import { Project_Colum } from '@/components/project/project_table';
import ProjectForm from '@/components/project/project_Form';
import { useNotification } from '../../../components/UI_shared/Notification';
import Header_Children from '@/components/UI_shared/Children_Head';
import { showDateFormat } from '@/utils/date';
const ProjectPage = () => {
  const [Projects, setProjects] = useState<Get_project[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingProject, setEditingProject] = useState<Up_project | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [orderType, setOrderType] = useState<'ASC' | 'DESC'>('ASC');
  const [form] = Form.useForm();
  const [total, setTotal] = useState<number>(10);
  const { show } = useNotification();
  const [documents, setDocuments] = useState<any[]>([]);
  const [newID, setNewID] = useState<number>(0);
  useEffect(() => {
    ProjectsByPageOrder(currentPage, pageSize, orderType, searchText);
  }, [currentPage, pageSize, orderType, searchText]);

  const ProjectsByPageOrder = async (
    pageIndex: number,
    pageSize: number,
    orderType: 'ASC' | 'DESC',
    ProjectName?: string,
  ) => {
    try {
      setLoading(true);
      const data = await projectAPI.getprojectsByPageOrder(
        pageIndex,
        pageSize,
        orderType,
        ProjectName,
      );
      setTotal(data[0].TotalRecords);
      setProjects(data);
    } catch (error) {
      show({
        result: 1,
        messageError: 'Lỗi tải danh sách dự án',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    setSearchText('');
    ProjectsByPageOrder(1, pageSize, orderType);
  };

  const handleSearch = (value: string) => {
    ProjectsByPageOrder(1, pageSize, orderType, value);
  };

  const openCreateModal = () => {
    setEditingProject(null);
    setIsEditing(false);
    form.resetFields();
    setModalVisible(true);
  };

  const openEditModal = (record: Get_project) => {
    setEditingProject(record);
    setIsEditing(true);
    const formattedValues = {
      ...record,
      ProjectStartDate: showDateFormat(record.ProjectStartDate),
      ProjectEndDate: showDateFormat(record.ProjectEndDate),
    };
    form.setFieldsValue(formattedValues);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setEditingProject(null);
    setIsEditing(false);
    form.resetFields();
  };

  const handleDelete = async (record: Get_project) => {
    try {
      const data: any = await projectAPI.deleteproject(record.Id);

      show({
        result: data.result,
        messageDone: 'Xóa dự án thành công',
        messageError: 'Xóa dự án thất bại',
      });
      ProjectsByPageOrder(currentPage, pageSize, orderType);
    } catch (error) {
      show({
        result: 1,
        messageError: 'Lỗi xóa dự án',
      });
    }
  };

  const updateProject = async (Id: number, project: Add_project) => {
    const newProject = {
      Id: Id,
      ...project,
    };
    const result: any = await projectAPI.updateproject(newProject);
    show({
      result: result.result,
      messageDone: 'Cập nhật dự án thành công',
      messageError: 'Cập nhật dự án thất bại',
    });
  };

  const addProject = async (newProject: any) => {
    if (newProject.ProjectEndDate > newProject.ProjectStartDate) {
      const result: any = await projectAPI.createproject(newProject);
      setNewID(result.result);
      show({
        result: result.result,
        messageDone: 'Thêm dự án thành công',
        messageError: 'Thêm dự án thất bại',
      });
    } else {
      show({
        result: 1,
        messageError: 'Ngày kết thúc phải sau ngày bắt đầu',
      });
    }
  };
  const handleSave = async () => {
    try {
      const values: any = await form.validateFields();

      setLoading(true);
      editingProject
        ? await updateProject(editingProject.Id, values)
        : await addProject(values);

      await ProjectsByPageOrder(currentPage, pageSize, orderType);
      closeModal();
    } catch (error) {
      show({
        result: 1,
        messageError: 'Lỗi lưu dự án',
      });
    } finally {
      setLoading(false);
    }
  };

  const columns = COLUMNS({
    columnType: Project_Colum,
    openModal: openEditModal,
    handleDelete: handleDelete,
  });

  return (
    <Card className="p-6">
      <Header_Children
        title={'Quản lý dự án'}
        onAdd={openCreateModal}
        text_btn_add="Thêm dự án"
      />

      <hr />

      <div className="py-4">
        <Space size="middle">
          <Input.Search
            placeholder="Search Projects..."
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
          dataSource={Projects}
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
        title={editingProject ? 'Cập nhập dự án' : 'Thêm dự án'}
        open={modalVisible}
        onOk={handleSave}
        onCancel={closeModal}
        width="60%"
      >
        <ProjectForm
          formdulieu={form}
          documents={documents}
          setDocuments={setDocuments}
        />
      </Modal>
    </Card>
  );
};

export default ProjectPage;
