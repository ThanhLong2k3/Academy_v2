'use client';

import { useState, useEffect, useCallback } from 'react';
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
import { Partner_DTO } from '@/models/partners.model';
import { Department_DTO, GetDepartment } from '@/models/department.model';
import { DepartmentAPI } from '@/libs/api/department.api';
import { PartnerAPI } from '@/libs/api/partner.api';
import { uploadFile } from '@/libs/api/upload.api';
import { documentAPI } from '@/libs/api/document.api';
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
  const [partners, setPartners] = useState<Partner_DTO[]>([]);
  const [departments, setDepartments] = useState<Department_DTO[]>([]);
  const [documentAfter, setDocumentAfter] = useState<any[]>([]);

  useEffect(() => {
    ProjectsByPageOrder(currentPage, pageSize, orderType, searchText);
    getDepartment();
    getPartner();
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

  const openEditModal = useCallback(
    async (record: Get_project) => {
      const dataDocuments = await documentAPI.GetDocuments_by_IdRelated(
        record.Id,
        'Project',
      );
      setDocumentAfter(dataDocuments || []);
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
    if (
      project.ProjectEndDate &&
      project.ProjectEndDate < project.ProjectStartDate
    ) {
      show({
        result: 1,
        messageError: 'Ngày kết thúc phải sau ngày bắt đầu',
      });
      return null;
    }
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

  const addProject = useCallback(async (newProject: any) => {
    if (
      newProject.ProjectEndDate &&
      newProject.ProjectEndDate < newProject.ProjectStartDate
    ) {
      show({
        result: 1,
        messageError: 'Ngày kết thúc phải sau ngày bắt đầu',
      });
      return null;
    }
    const result: any = await projectAPI.createproject(newProject);
    show({
      result: result.result,
      messageDone: 'Thêm dự án thành công',
      messageError: 'Thêm dự án thất bại',
    });
    return result.result;
  }, []);

  const addDocuments = useCallback(
    async (ID_Product: number, uploadedDocuments: any) => {
      if (uploadedDocuments.length > 0) {
        for (const doc of uploadedDocuments) {
          await documentAPI.createdocument({
            DocumentName: doc.DocumentName,
            DocumentLink: doc.DocumentLink,
            RelatedId: ID_Product,
            RelatedType: 'Project',
          });
        }
      }
    },
    [],
  );

  const UpDocuments = useCallback(async (documentupload: any[]) => {
    const updatedDataDocuments = documentupload.filter(
      (doc: any) =>
        !documentAfter.some(
          (newDoc: any) =>
            newDoc.DocumentName === doc.DocumentName &&
            newDoc.DocumentLink === doc.DocumentLink,
        ),
    );
    if (updatedDataDocuments.length > 0) {
      for (const doc of updatedDataDocuments) {
        await documentAPI.updatedocument(doc);
      }
    }
  }, []);

  const handleSave = async () => {
    try {
      const values: any = await form.validateFields();
      debugger;
      setLoading(true);
      let uploadedDocuments: any = [];
      let newIDProject, result: any;
      if (documents.length > 0) {
        const result = await uploadFile(documents);
        uploadedDocuments = result.documents || [];
      }
      if (editingProject) {
        result = await updateProject(editingProject.Id, values);
        await UpDocuments(uploadedDocuments);
        const newDocuments = uploadedDocuments.filter((doc: any) => !doc.Id);
        await addDocuments(editingProject.Id, newDocuments);
      } else {
        newIDProject = await addProject(values);
        await addDocuments(newIDProject, uploadedDocuments);
      }
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
