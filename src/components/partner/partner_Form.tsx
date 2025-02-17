import React, { useState, useEffect } from 'react';
import { Form, Input, FormInstance, Row, Col, Select } from 'antd';
import { RULES_FORM } from '@/utils/validator';

interface ReusableFormProps {
  formdulieu: FormInstance<any> | undefined;
}

export const PartnerForm: React.FC<ReusableFormProps> = ({ formdulieu }) => {
  return (
    <Form form={formdulieu} layout="vertical">
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            name="PartnerName"
            label="Tên đối tác"
            rules={RULES_FORM.department_name}
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
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            name="StartDate"
            label="Ngày hợp tác"
            rules={RULES_FORM.required}
          >
            <Input type="Date" />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item name="EndDate" label="Ngày kết thúc">
            <Input type="Date" />
          </Form.Item>
        </Col>
      </Row>
      <Form.Item
        name="PartnershipStatus"
        label="Trạng thái hợp tác"
        rules={RULES_FORM.required}
      >
        <Select>
          <Select.Option key="1" value="Đang hợp tác">
            Đang hợp tác
          </Select.Option>
          <Select.Option key="2" value="Dừng hợp tác">
            Dừng hợp tác
          </Select.Option>
        </Select>
      </Form.Item>
    </Form>
  );
};
