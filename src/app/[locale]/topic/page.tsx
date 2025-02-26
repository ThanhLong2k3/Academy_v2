'use client';

import { useState, useEffect, useCallback } from 'react';
import { Table, Button, Modal, Form, Input, Space, Card, message } from 'antd';
import { SearchOutlined, ReloadOutlined } from '@ant-design/icons';
import type { GetTopic, AddTopic } from '@/models/topic.model';
import { topicAPI } from '@/libs/api/topic.api';
import { COLUMNS } from '../../../components/UI_shared/Table';
import { Topic_Colum } from '@/components/topic/topic_Table';
import { TopicForm } from '@/components/topic/topic_Form';
import { useNotification } from '../../../components/UI_shared/Notification';
import Header_Children from '@/components/UI_shared/Children_Head';
import { showDateFormat } from '@/utils/date';
import { uploadFile } from '@/libs/api/upload.api';
import { documentAPI } from '@/libs/api/document.api';
import type { Department_DTO } from '@/models/department.model';
import { DepartmentAPI } from '@/libs/api/department.api';
import { useAddDocuments, useUpdateDocuments } from '../document/page';

const TopicPage = () => {
  const [Topics, setTopics] = useState<GetTopic[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingTopic, setEditingTopic] = useState<GetTopic | null>(null);
  const [searchText, setSearchText] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [orderType, setOrderType] = useState<'ASC' | 'DESC'>('ASC');
  const [form] = Form.useForm();
  const [total, setTotal] = useState<number>(10);
  const { show } = useNotification();
  const [documents, setDocuments] = useState<any[]>([]);
  const [departments, setDepartments] = useState<Department_DTO[]>([]);
  const [documentAfter, setDocumentAfter] = useState<any[]>([]);
  const { updateDocuments } = useUpdateDocuments();
  const { addDocuments } = useAddDocuments();
  const fetchTopics = useCallback(async () => {
    try {
      setLoading(true);
      const data = await topicAPI.gettopicsByPageOrder(
        currentPage,
        pageSize,
        orderType,
        searchText,
      );
      setTotal(data[0].TotalRecords);
      setTopics(data);
    } catch (error) {
      show({
        result: 1,
        messageError: 'Lỗi tải danh sách đề tài',
      });
    } finally {
      setLoading(false);
    }
  }, [currentPage, pageSize, orderType, searchText]);

  const fetchDepartments = useCallback(async () => {
    const data = await DepartmentAPI.getDepartmentByPageOrder(1, 100, 'ASC');
    setDepartments(data);
  }, []);

  useEffect(() => {
    fetchTopics();
    fetchDepartments();
  }, [fetchTopics, fetchDepartments]);

  const handleRefresh = useCallback(() => {
    setSearchText('');
    setCurrentPage(1);
    fetchTopics();
  }, [fetchTopics]);

  const handleSearch = useCallback((value: string) => {
    setSearchText(value);
    setCurrentPage(1);
  }, []);

  const handlePageChange = useCallback((page: number, size: number) => {
    setCurrentPage(page);
    setPageSize(size);
  }, []);

  const openCreateModal = useCallback(() => {
    setEditingTopic(null);
    form.resetFields();
    setModalVisible(true);
  }, [form]);

  const openEditModal = useCallback(
    async (record: GetTopic) => {
      const dataDocuments = await documentAPI.GetDocuments_by_IdRelated(
        record.Id,
        'Topic',
      );
      setDocumentAfter(dataDocuments || []);
      setDocuments(dataDocuments || []);

      setEditingTopic(record);
      const formattedValues = {
        ...record,
        TopicStartDate: showDateFormat(record.TopicStartDate),
        TopicEndDate: showDateFormat(record.TopicEndDate),
      };
      form.setFieldsValue(formattedValues);
      setModalVisible(true);
    },
    [form],
  );

  const closeModal = useCallback(() => {
    setDocuments([]);
    setModalVisible(false);
    setEditingTopic(null);
    form.resetFields();
  }, [form]);

  const handleDelete = useCallback(
    async (record: GetTopic) => {
      try {
        const data: any = await topicAPI.deletetopic(record.Id);
        show({
          result: data.result,
          messageDone: 'Xóa đề tài thành công',
          messageError: 'Xóa đề tài thất bại',
        });
        fetchTopics();
      } catch (error) {
        show({
          result: 1,
          messageError: 'Lỗi xóa đề tài',
        });
      }
    },
    [fetchTopics, show],
  );

  const addTopic = useCallback(async (newTopic: AddTopic) => {
    if (
      newTopic.TopicEndDate &&
      newTopic.TopicEndDate < newTopic.TopicStartDate
    ) {
      show({
        result: 1,
        messageError: 'Ngày kết thúc phải lớn hơn ngày bắt đầu',
      });
      return null;
    }
    const result: any = await topicAPI.createtopic(newTopic);
    return result.result;
  }, []);

  const updateTopic = useCallback(async (Id: number, Topic: AddTopic) => {
    if (Topic.TopicEndDate && Topic.TopicEndDate < Topic.TopicStartDate) {
      show({
        result: 1,
        messageError: 'Ngày kết thúc phải lớn hơn ngày bắt đầu',
      });
      return null;
    }
    const newTopic = { Id, ...Topic };
    const result: any = await topicAPI.updatetopic(newTopic);
    return result.result;
  }, []);

  const handleSave = async () => {
    try {
      const values: any = await form.validateFields();
      setLoading(true);

      let uploadedDocuments: any = [];
      let newIDTopic, result: any;

      if (documents.length > 0) {
        const uploadResult = await uploadFile(documents);
        uploadedDocuments = uploadResult.documents || [];
      }
      debugger;
      if (editingTopic) {
        result = await updateTopic(editingTopic.Id, values);
        if (result === 0) {
          const dataDocuments = await documentAPI.GetDocuments_by_IdRelated(
            editingTopic.Id,
            'Topic',
          );
          const updateResult = await updateDocuments(
            uploadedDocuments,
            dataDocuments,
          );
          const addResult = await addDocuments(
            'Topic',
            editingTopic.Id,
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
        newIDTopic = await addTopic(values);
        if (newIDTopic) {
          const addResult = await addDocuments(
            'Topic',
            newIDTopic,
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

      fetchTopics();
      closeModal();
    } catch (error) {
      show({ result: 1, messageError: 'Lỗi lưu dự án' });
    } finally {
      setLoading(false);
    }
  };

  const columns = COLUMNS({
    columnType: Topic_Colum,
    openModal: openEditModal,
    handleDelete: handleDelete,
  });

  return (
    <Card className="p-6">
      <Header_Children
        title={'Quản lý đề tài'}
        onAdd={openCreateModal}
        text_btn_add="Thêm đề tài"
      />

      <hr />

      <div className="py-4">
        <Space size="middle">
          <Input.Search
            placeholder="Search Topics..."
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
          dataSource={Topics}
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
            onChange: handlePageChange,
          }}
        />
      </div>

      <Modal
        title={editingTopic ? 'Cập nhập đề tài' : 'Thêm đề tài'}
        open={modalVisible}
        onOk={handleSave}
        onCancel={closeModal}
        width="60%"
        confirmLoading={loading}
      >
        <TopicForm
          formdata={form}
          documents={documents}
          setDocuments={setDocuments}
          departments={departments}
        />
      </Modal>
    </Card>
  );
};

export default TopicPage;
