import React from 'react';
import { Form, Input, FormInstance } from 'antd';
import { RULES_FORM } from '@/utils/validator';
import TextArea from 'antd/es/input/TextArea';
interface ReusableFormProps {
  formdulieu: FormInstance<any> | undefined;
  isEditing: Boolean;
}

export const DepartmentForm: React.FC<ReusableFormProps> = ({ formdulieu }) => (
  <Form form={formdulieu} layout="vertical">
    <Form.Item
      name="DepartmentName"
      label="Tên đơn vị"
      rules={RULES_FORM.required}
    >
      <Input />
    </Form.Item>
    <Form.Item name="Description" label="Mô tả" rules={RULES_FORM.required}>
      <TextArea />
    </Form.Item>
  </Form>
);
