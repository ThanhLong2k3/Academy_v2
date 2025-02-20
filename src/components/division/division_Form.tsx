import React, { useState, useEffect } from 'react';
import { Form, Input, FormInstance, Row, Col, Select } from 'antd';
import { RULES_FORM } from '@/utils/validator';
import TextArea from 'antd/es/input/TextArea';
import { Department_DTO } from '@/models/department.model';
interface ReusableFormProps {
  formdata: FormInstance<any> | undefined;
  departments: Department_DTO[];
}

export const DivisiontForm: React.FC<ReusableFormProps> = ({
  formdata,
  departments,
}) => {
  return (
    <Form form={formdata} layout="vertical">
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            name="DepartmentId"
            label="Chọn đơn vị"
            rules={RULES_FORM.required}
          >
            <Select
              options={departments.map((department) => ({
                label: department.DepartmentName,
                value: department.DepartmentId,
              }))}
            />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="DivisionName"
            label="Tên phòng ban"
            rules={RULES_FORM.required}
          >
            <Input />
          </Form.Item>
        </Col>
      </Row>
      <Form.Item name="Description" label="Mô tả" rules={RULES_FORM.required}>
        <TextArea />
      </Form.Item>
    </Form>
  );
};
