import React, { useEffect } from 'react';
import { Form, Input, FormInstance, Row, Col, Select } from 'antd';
import { RULES_FORM } from '@/utils/validator';

import TextArea from 'antd/es/input/TextArea';
import { GetPersonnel } from '@/models/persionnel.model';

interface ReusableFormProps {
  formdata: FormInstance<any> | undefined;
  personnels: GetPersonnel[];
}

export const TrainingCouseForm: React.FC<ReusableFormProps> = ({
  formdata,
  personnels,
}) => {
  return (
    <Form form={formdata} layout="vertical">
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            name="CourseName"
            label="Tên khóa học"
            rules={RULES_FORM.required}
          >
            <Input />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="InstructorId"
            label="Tên giảng viên"
            rules={RULES_FORM.required}
          >
            <Select
              options={personnels.map((di) => ({
                label: di.PersonnelName,
                value: di.Id,
              }))}
            />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            name="Duration"
            label="Tổng thời gian (Tuần)"
            rules={RULES_FORM.number}
          >
            <Input type="number" />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="ServiceStatus"
            label="Trạng thái "
            rules={RULES_FORM.required}
          >
            <Select>
              <Select.Option key="1" value="Đang diễn ra">
                Đang diễn ra
              </Select.Option>
              <Select.Option key="2" value="Đã hoàn thành">
                Đã hoàn thành
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
