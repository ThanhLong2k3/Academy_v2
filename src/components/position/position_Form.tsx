import React from 'react';
import { Form, Input, FormInstance } from 'antd';
import { RULES_FORM } from '@/utils/validator';
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
      rules={RULES_FORM.required}
    >
      <Input />
    </Form.Item>
  </Form>
);
