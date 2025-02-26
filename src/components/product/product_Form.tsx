'use client';

import type React from 'react';
import {
  Form,
  Input,
  Button,
  Row,
  Col,
  Upload,
  Select,
  Card,
  Typography,
} from 'antd';
import { FileOutlined, PlusOutlined, UploadOutlined } from '@ant-design/icons';
import { RULES_FORM } from '@/utils/validator';
import { documentAPI } from '@/libs/api/document.api';
import { useNotification } from '../UI_shared/Notification';
import { Popconfirm, Tooltip } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';

const { Text } = Typography;
interface ReusableFormProps {
  departments: any[];
  formdata: any;
  documents: any[];
  setDocuments: React.Dispatch<React.SetStateAction<any[]>>;
}

export const ProductForm: React.FC<ReusableFormProps> = ({
  formdata,
  documents,
  setDocuments,
  departments,
}) => {
  const { show } = useNotification();
  const updateDocument = (index: number, field: string, value: any) => {
    const newDocs = [...documents];
    newDocs[index][field] = value;
    setDocuments(newDocs);
  };

  const addDocument = () => {
    setDocuments([
      ...documents,
      { DocumentName: '', DocumentFile: null, DocumentLink: '' },
    ]);
  };

  const removeDocument = async (index: number, Id?: number) => {
    if (Id) {
      const result: any = await documentAPI.deletedocument(Id);
      show({
        result: result.result,
        messageDone: 'Xóa tài liệu thành công !',
        messageError: 'Xóa tài liệu thất bại! ',
      });
    }
    setDocuments(documents.filter((_, i) => i !== index));
  };

  return (
    <Form form={formdata} layout="vertical">
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
          <Row
            gutter={16}
            key={index}
            align="middle"
            style={{ marginBottom: 16 }}
          >
            <Col span={11}>
              <Form.Item label="Tên tài liệu" required>
                <Input
                  value={doc.DocumentName}
                  onChange={(e) =>
                    updateDocument(index, 'DocumentName', e.target.value)
                  }
                />
              </Form.Item>
            </Col>
            <Col span={11}>
              <Form.Item label="Tải file lên" required>
                <Upload
                  beforeUpload={(file) => {
                    updateDocument(index, 'DocumentFile', file);
                    return false; // Ngăn upload tự động
                  }}
                  showUploadList={false}
                >
                  <Button icon={<UploadOutlined />}>Chọn file</Button>
                </Upload>
                {/* Hiển thị file mới nhất */}
                {doc.DocumentFile ? (
                  <Text>
                    <FileOutlined style={{ marginRight: 8 }} />
                    {doc.DocumentFile.name.length > 30
                      ? `${doc.DocumentFile.name.substring(0, 30)}...`
                      : doc.DocumentFile.name}
                  </Text>
                ) : doc.DocumentLink ? (
                  <Text>
                    <FileOutlined style={{ marginRight: 8 }} />
                    <a
                      href={doc.DocumentLink}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {doc.DocumentLink.replace('/uploads/', '').length > 20
                        ? `${doc.DocumentLink.replace('/uploads/', '').substring(0, 17)}...`
                        : doc.DocumentLink.replace('/uploads/', '')}
                    </a>
                  </Text>
                ) : null}
              </Form.Item>
            </Col>
            <Col span={2}>
              <Popconfirm
                title="Bạn có chắc chắn muốn xóa?"
                onConfirm={() => removeDocument(index, doc.Id)}
                okText="Có"
                cancelText="Không"
              >
                <Tooltip title="Xóa">
                  <Button
                    shape="circle"
                    icon={<DeleteOutlined />}
                    style={{ backgroundColor: 'red', color: 'white' }}
                  />
                </Tooltip>
              </Popconfirm>
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
