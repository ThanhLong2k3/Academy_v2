import React, { useState, useEffect } from 'react';
import { Form, Input, FormInstance, Row, Col, Select } from 'antd';
import { RULES_FORM } from '@/utils/validator';
import TextArea from 'antd/es/input/TextArea';
import { GetDepartment } from '@/models/department.model';
import { DepartmentAPI } from '@/libs/api/department.api';
interface ReusableFormProps {
  formdulieu: FormInstance<any> | undefined;
}

export const DivisiontForm: React.FC<ReusableFormProps> = ({ formdulieu }) => {
  const [departments, setDepartments] = useState<any[]>([]);

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    const data = await DepartmentAPI.getDepartmentByPageOrder(1, 100, 'ASC');
    console.log(data);
    setDepartments(data);
  };

  return (
    <Form form={formdulieu} layout="vertical">
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
