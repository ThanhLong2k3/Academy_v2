import React from 'react';
import { Form, Input, FormInstance, DatePicker, Switch } from 'antd';
import { RULES_FORM } from '@/utils/validator';

interface ReusableFormProps {
  formdulieu: FormInstance<any> | undefined;
  isEditing: boolean;
}

export const PersonnelForm: React.FC<ReusableFormProps> = ({
  formdulieu,
  isEditing,
}) => (
  <Form form={formdulieu} layout="vertical">
    <Form.Item name="Id" label="Mã nhân viên">
      <Input disabled={isEditing} />
    </Form.Item>
    <Form.Item
      name="PersonnelName"
      label="Tên nhân viên"
      rules={RULES_FORM.required}
    >
      <Input />
    </Form.Item>
    <Form.Item name="DivisionId" label="Mã bộ phận">
      <Input />
    </Form.Item>
    <Form.Item name="PositionId" label="Mã chức vụ">
      <Input />
    </Form.Item>
    <Form.Item name="DateOfBirth" label="Ngày sinh">
      <DatePicker format="YYYY-MM-DD" style={{ width: '100%' }} />
    </Form.Item>
    <Form.Item name="Email" label="Email" rules={RULES_FORM.email}>
      <Input />
    </Form.Item>
    <Form.Item name="PhoneNumber" label="Số điện thoại">
      <Input />
    </Form.Item>
    <Form.Item name="JoinDate" label="Ngày vào làm">
      <DatePicker format="YYYY-MM-DD" style={{ width: '100%' }} />
    </Form.Item>
    <Form.Item name="EndDate" label="Ngày kết thúc">
      <DatePicker format="YYYY-MM-DD" style={{ width: '100%' }} />
    </Form.Item>
    <Form.Item name="WorkStatus" label="Trạng thái công việc">
      <Input />
    </Form.Item>
    <Form.Item name="IsDeleted" label="Đã xóa" valuePropName="checked">
      <Switch />
    </Form.Item>
  </Form>
);
