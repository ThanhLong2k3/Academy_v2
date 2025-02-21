import React, { useState, useEffect } from 'react';
import {
  Form,
  Input,
  FormInstance,
  Row,
  Col,
  Select,
  Upload,
  Button,
} from 'antd';
import { RULES_FORM } from '@/utils/validator';
import { Department_DTO } from '@/models/department.model';
import { UploadOutlined } from '@ant-design/icons';
import TextArea from 'antd/lib/input/TextArea';

interface ReusableFormProps {
  formData: FormInstance<any> | undefined;
  departments: Department_DTO[];
}

export const IntellectualPropertyForm: React.FC<ReusableFormProps> = ({
  formData,
  departments,
}) => {
  const normFile = (e: any) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList || [];
  };
  return (
    <Form form={formData} layout="vertical">
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            name="IntellectualPropertyName"
            label="Tên chứng nhận"
            rules={RULES_FORM.required}
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
            name="IntellectualPropertyImage"
            label="Ảnh đại diện"
            valuePropName="fileList"
            getValueFromEvent={normFile}
          >
            <Upload
              listType="picture"
              maxCount={1}
              beforeUpload={() => false} // Ngăn tải lên tự động
            >
              <Button icon={<UploadOutlined />}>Tải ảnh lên</Button>
            </Upload>
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="IntellectualPropertyStatus"
            label="Trạng thái"
            rules={RULES_FORM.required}
          >
            <Select>
              <Select.Option key="1" value="Đã được cấp">
                Đã được cấp
              </Select.Option>
              <Select.Option key="2" value="Đang xét duyệt">
                Đang xét duyệt
              </Select.Option>
            </Select>
          </Form.Item>
        </Col>
      </Row>
      <Form.Item name="Description" label="Mô tả" rules={RULES_FORM.required}>
        <TextArea />
      </Form.Item>
    </Form>
  );
};
