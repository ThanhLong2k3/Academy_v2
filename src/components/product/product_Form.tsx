'use client';

import type React from 'react';
import { useState, useEffect } from 'react';
import {
  Form,
  Input,
  Button,
  Row,
  Col,
  Upload,
  Select,
  Card,
  message,
} from 'antd';
import {
  MinusCircleOutlined,
  PlusOutlined,
  UploadOutlined,
} from '@ant-design/icons';
import { RULES_FORM } from '@/utils/validator';
import type { GetDepartment } from '@/models/department.model';
import { DepartmentAPI } from '@/libs/api/department.api';

interface ReusableFormProps {
  formdulieu: any;
  documents: any[];
  setDocuments: React.Dispatch<React.SetStateAction<any[]>>;
  adddataa: any;
  onDocumentsUpdated?: (documents: any[]) => void;
}

export const ProductForm: React.FC<ReusableFormProps> = ({
  formdulieu,
  documents,
  setDocuments,
  adddataa,
  onDocumentsUpdated,
}) => {
  const [departments, setDepartment] = useState<GetDepartment[]>([]);
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);

  useEffect(() => {
    fetchDepartments();
  }, []);

  useEffect(() => {
    if (adddataa !== null) {
      uploadFile();
    }
  }, [adddataa]);

  const fetchDepartments = async () => {
    const data = await DepartmentAPI.getDepartmentByPageOrder(1, 100, 'ASC');
    setDepartment(data);
  };

  const uploadFile = async () => {
    if (documents.length === 0) {
      return;
    }

    const formData = new FormData();
    let hasFiles = false;
    let filesCount = 0;

    // First, count how many files we need to upload
    documents.forEach((doc) => {
      if (doc.DocumentFile && !doc.DocumentUrl) {
        filesCount++;
      }
    });

    if (filesCount === 0) {
      return;
    }

    // Then append files to FormData
    documents.forEach((doc, index) => {
      if (doc.DocumentFile && !doc.DocumentUrl) {
        formData.append(`file_${index}`, doc.DocumentFile);
        hasFiles = true;
      }
    });

    if (!hasFiles) {
      return;
    }

    try {
      const response = await fetch('/api/uploadImage', {
        method: 'POST',
        body: formData,
      });
      const result = await response.json();

      if (result.status === 'success' && result.uploadedPaths) {
        setUploadedFiles(result.uploadedPaths);

        // Create a copy of documents to modify
        const updatedDocuments = [...documents];
        let uploadedIndex = 0;

        // Update documents with new URLs
        updatedDocuments.forEach((doc, index) => {
          if (doc.DocumentFile && !doc.DocumentUrl) {
            updatedDocuments[index] = {
              ...doc,
              DocumentUrl: result.uploadedPaths[uploadedIndex],
            };
            uploadedIndex++;
          }
        });
        setDocuments(updatedDocuments);
        if (onDocumentsUpdated) {
          onDocumentsUpdated(updatedDocuments);
        }
        message.success(
          `${result.uploadedPaths.length} files uploaded successfully`,
        );
      } else {
        message.error('File upload failed');
      }
    } catch (error) {
      console.error('Error uploading files:', error);
      message.error('Error uploading files');
    }
  };

  const updateDocument = (index: number, field: string, value: any) => {
    const newDocs = [...documents];
    newDocs[index][field] = value;
    setDocuments(newDocs);
  };

  const addDocument = () => {
    setDocuments([
      ...documents,
      { DocumentName: '', DocumentFile: null, DocumentUrl: '' },
    ]);
  };

  const removeDocument = (index: number) => {
    setDocuments(documents.filter((_, i) => i !== index));
  };

  return (
    <Form form={formdulieu} layout="vertical">
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            name="ProductName"
            label="Tên sản phẩm"
            rules={RULES_FORM.department_name}
          >
            <Input />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="DepartmentId"
            label="Tên đơn vị"
            rules={RULES_FORM.required}
          >
            <Select
              options={departments.map((dept: any) => ({
                label: dept.DepartmentName,
                value: dept.DepartmentId,
              }))}
            />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            name="ProductStartDate"
            label="Ngày bắt đầu"
            rules={RULES_FORM.required}
          >
            <Input type="date" />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item name="ProductEndDate" label="Ngày kết thúc">
            <Input type="date" />
          </Form.Item>
        </Col>
      </Row>

      <Form.Item
        name="ProductStatus"
        label="Trạng thái sản phẩm"
        rules={RULES_FORM.required}
      >
        <Select>
          <Select.Option value="Đang thực hiện">Đang thực hiện</Select.Option>
          <Select.Option value="Đã hoàn thành">Đã hoàn thành</Select.Option>
        </Select>
      </Form.Item>

      <Card title="Tài liệu đính kèm">
        {documents.map((doc, index) => (
          <Row gutter={16} key={index} align="middle">
            <Col span={8}>
              <Form.Item label="Tên tài liệu" required>
                <Input
                  value={doc.DocumentName}
                  onChange={(e) =>
                    updateDocument(index, 'DocumentName', e.target.value)
                  }
                />
              </Form.Item>
            </Col>
            <Col span={10}>
              <Form.Item label="Tải file lên" required>
                <Upload
                  beforeUpload={(file) => {
                    updateDocument(index, 'DocumentFile', file);
                    return false;
                  }}
                  showUploadList={false}
                >
                  <Button icon={<UploadOutlined />}>Chọn file</Button>
                </Upload>
                {doc.DocumentFile && <p>{doc.DocumentFile.name}</p>}
                {doc.DocumentUrl && (
                  <p>
                    <a
                      href={doc.DocumentUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Xem file
                    </a>
                  </p>
                )}
              </Form.Item>
            </Col>
            <Col span={4}>
              <Button
                danger
                type="link"
                onClick={() => removeDocument(index)}
                icon={<MinusCircleOutlined />}
              />
            </Col>
          </Row>
        ))}
        <Button
          type="dashed"
          onClick={addDocument}
          block
          icon={<PlusOutlined />}
        >
          Thêm tài liệu
        </Button>
      </Card>
    </Form>
  );
};
