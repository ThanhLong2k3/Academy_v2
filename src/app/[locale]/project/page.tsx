'use client';

import { useState, useEffect, useCallback } from 'react';
import { Table, Button, Modal, Form, Space, Card, Input } from 'antd';
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
import { Partner_DTO } from '@/models/partners.model';
import { Department_DTO } from '@/models/department.model';
import { DepartmentAPI } from '@/libs/api/department.api';
import { PartnerAPI } from '@/libs/api/partner.api';
import { uploadFile } from '@/libs/api/upload.api';
import { documentAPI } from '@/libs/api/document.api';
import { useAddDocuments, useUpdateDocuments } from '../document/page';

const ProjectPage = () => {
  const [projects, setProjects] = useState<Get_project[]>([]);
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
  const [partners, setPartners] = useState<Partner_DTO[]>([]);
  const [departments, setDepartments] = useState<Department_DTO[]>([]);
  const { updateDocuments } = useUpdateDocuments();
  const { addDocuments } = useAddDocuments();

  const refreshProjects = useCallback(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const data = await projectAPI.getprojectsByPageOrder(
          currentPage,
          pageSize,
          orderType,
          searchText,
        );
        setTotal(data[0].TotalRecords);
        setProjects(data);
      } catch (error) {
        show({ result: 1, messageError: 'Lỗi tải danh sách dự án' });
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, [currentPage, pageSize, orderType, searchText]);

  useEffect(() => {
    refreshProjects();
    getDepartment();
    getPartner();
  }, [refreshProjects]);

  const getDepartment = async () => {
    const data = await DepartmentAPI.getDepartmentByPageOrder(1, 100, 'ASC');
    setDepartments(data);
  };

  const getPartner = async () => {
    const data = await PartnerAPI.getPartnersByPageOrder(1, 100, 'ASC');
    setPartners(data);
  };

  const handleRefresh = () => {
    setSearchText('');
    setCurrentPage(1);
    refreshProjects();
  };

  const handleSearch = (value: string) => {
    setSearchText(value);
    setCurrentPage(1);
    refreshProjects();
  };

  const openCreateModal = async () => {
    setEditingProject(null);
    setIsEditing(false);
    form.resetFields();

    setDocuments([]);
    setModalVisible(true);
  };

  const openEditModal = useCallback(
    async (record: Get_project) => {
      const dataDocuments = await documentAPI.GetDocuments_by_IdRelated(
        record.Id,
        'Project',
      );
      setDocuments(dataDocuments || []);
      setEditingProject(record);
      setIsEditing(true);
      const formattedValues = {
        ...record,
        ProjectStartDate: showDateFormat(record.ProjectStartDate),
        ProjectEndDate: showDateFormat(record.ProjectEndDate),
      };
      form.setFieldsValue(formattedValues);
      setModalVisible(true);
    },
    [form],
  );

  const closeModal = () => {
    setModalVisible(false);
    setEditingProject(null);
    setIsEditing(false);
    form.resetFields();
    setDocuments([]);
  };

  const handleDelete = async (record: Get_project) => {
    try {
      const data: any = await projectAPI.deleteproject(record.Id);
      show({
        result: data.result,
        messageDone: 'Xóa dự án thành công',
        messageError: 'Xóa dự án thất bại',
      });
      refreshProjects();
    } catch (error) {
      show({ result: 1, messageError: 'Lỗi xóa dự án' });
    }
  };

  const updateProject = async (Id: number, project: Add_project) => {
    if (
      project.ProjectEndDate &&
      project.ProjectEndDate < project.ProjectStartDate
    ) {
      show({ result: 1, messageError: 'Ngày kết thúc phải sau ngày bắt đầu' });
      return null;
    }
    const newProject = { Id, ...project };
    const result: any = await projectAPI.updateproject(newProject);
    return result.result;
  };

  const addProject = useCallback(async (newProject: any) => {
    if (
      newProject.ProjectEndDate &&
      newProject.ProjectEndDate < newProject.ProjectStartDate
    ) {
      show({ result: 1, messageError: 'Ngày kết thúc phải sau ngày bắt đầu' });
      return null;
    }
    const result: any = await projectAPI.createproject(newProject);
    return result.result;
  }, []);

  const handleSave = async () => {
    try {
      const values: any = await form.validateFields();
      setLoading(true);

      let uploadedDocuments: any = [];
      let newIDProject, result: any;

      if (documents.length > 0) {
        const uploadResult = await uploadFile(documents);
        uploadedDocuments = uploadResult.documents || [];
      }
      debugger;
      if (editingProject) {
        result = await updateProject(editingProject.Id, values);
        if (result === 0) {
          const dataDocuments = await documentAPI.GetDocuments_by_IdRelated(
            editingProject.Id,
            'Project',
          );
          const updateResult = await updateDocuments(
            uploadedDocuments,
            dataDocuments,
          );
          const addResult = await addDocuments(
            'Project',
            editingProject.Id,
            uploadedDocuments,
          );

          if (!updateResult.success) {
            show({
              result: 1,
              messageError: 'Cập nhật một số tài liệu thất bại!',
            });
            return;
          }
          if (!addResult.success) {
            show({ result: 1, messageError: 'Thêm một số tài liệu thất bại!' });
            return;
          }

          show({ result: 0, messageDone: 'Cập nhật dự án thành công!' });
        } else {
          show({ result: 1, messageError: 'Cập nhật dự án thất bại!' });
          return;
        }
      } else {
        newIDProject = await addProject(values);
        if (newIDProject) {
          const addResult = await addDocuments(
            'Project',
            newIDProject,
            uploadedDocuments,
          );
          if (!addResult.success) {
            show({ result: 1, messageError: 'Thêm một số tài liệu thất bại!' });
            return;
          }
          show({ result: 0, messageDone: 'Thêm dự án thành công!' });
        } else {
          show({ result: 1, messageError: 'Thêm dự án thất bại!' });
          return;
        }
      }

      refreshProjects();
      closeModal();
    } catch (error) {
      show({ result: 1, messageError: 'Lỗi lưu dự án' });
    } finally {
      setLoading(false);
    }
  };

  const columns = COLUMNS({
    columnType: Project_Colum,
    openModal: openEditModal,
    handleDelete,
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
          dataSource={projects}
          rowKey="Id"
          loading={loading}
          scroll={{ x: 800, y: 400 }}
          pagination={{
            current: currentPage,
            pageSize,
            total,
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
        title={editingProject ? 'Cập nhật dự án' : 'Thêm dự án'}
        open={modalVisible}
        onOk={handleSave}
        onCancel={closeModal}
        width="60%"
      >
        <ProjectForm
          formdata={form}
          documents={documents}
          setDocuments={setDocuments}
          partners={partners}
          departments={departments}
        />
      </Modal>
    </Card>
  );
};

export default ProjectPage;
