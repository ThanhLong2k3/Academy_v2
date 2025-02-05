import React from 'react';
import { Form, Input, FormInstance } from 'antd';

interface ReusableFormProps {
  formdulieu: FormInstance<any> | undefined;
  isEditing: Boolean;
}

export const PositionForm: React.FC<ReusableFormProps> = ({
  formdulieu,
  isEditing,
}) => (
  <Form form={formdulieu} layout="vertical">
    <Form.Item name="Id" label="Mã chức vụ">
      <Input disabled={isEditing === true} />
    </Form.Item>
    <Form.Item
      name="PositionName"
      label="Tên chức vụ"
      rules={[{ required: true, message: 'Vui lòng nhập tên chức vụ!' }]}
    >
      <Input />
    </Form.Item>
  </Form>
);
