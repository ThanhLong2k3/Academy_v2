import React, { useState, useEffect } from 'react';
import { Form, Input, FormInstance, Row, Col, Select } from 'antd';
import { RULES_FORM } from '@/utils/validator';
interface ReusableFormProps {
  formdulieu: FormInstance<any> | undefined;
}

export const CustomerForm: React.FC<ReusableFormProps> = ({ formdulieu }) => {
  return (
    <Form form={formdulieu} layout="vertical">
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            name="CustomerName"
            label="Tên khách hàng"
            rules={RULES_FORM.people_name}
          >
            <Input />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="PhoneNumber"
            label="Số điện thoại"
            rules={RULES_FORM.phone}
          >
            <Input />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item name="Email" label="Email" rules={RULES_FORM.email}>
            <Input />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item name="Address" label="Địa chỉ" rules={RULES_FORM.required}>
            <Input />
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
};
