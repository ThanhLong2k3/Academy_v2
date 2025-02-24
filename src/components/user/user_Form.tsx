import React, { useState, useEffect } from 'react';
import { Form, Input, FormInstance, Row, Col, Select } from 'antd';
import { RULES_FORM } from '@/utils/validator';
interface ReusableFormProps {
  formdulieu: FormInstance<any> | undefined;
}

export const UserForm: React.FC<ReusableFormProps> = ({ formdulieu }) => {
  return (
    <Form form={formdulieu} layout="vertical">
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            name="FullName"
            label="Tên người dùng"
            rules={RULES_FORM.people_name}
          >
            <Input />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item name="Email" label="Email" rules={RULES_FORM.email}>
            <Input />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item name="Role" label="Vai trò" rules={RULES_FORM.required}>
            <Select>
              <Select.Option key="1" value="admin">
                Quản trị viên
              </Select.Option>
              <Select.Option key="2" value="user">
                Người dùng
              </Select.Option>
            </Select>
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="Password"
            label="Mật khẩu"
            rules={RULES_FORM.password}
          >
            <Input type="password" />
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
};
