import React, { useEffect, useState } from 'react';
import { Form, Input, FormInstance, Row, Col, Card, Select } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import { RULES_FORM } from '@/utils/validator';
import { Partner_DTO } from '@/models/partners.model';
import { GetDepartment } from '@/models/department.model';
import { DepartmentAPI } from '@/libs/api/department.api';
import { PartnerAPI } from '@/libs/api/partner.api';

interface ReusableFormProps {
  formdulieu: FormInstance<any> | undefined;
  documents: any[];
  setDocuments: any;
}

const ProjectForm: React.FC<ReusableFormProps> = ({ formdulieu }) => {
  const [partners, setPartner] = useState<Partner_DTO[]>([]);
  const [departments, setDepartments] = useState<GetDepartment[]>([]);

  useEffect(() => {
    getDepartment();
    getPartner();
  }, []);
  const getDepartment = async () => {
    const data = await DepartmentAPI.getDepartmentByPageOrder(1, 100, 'ASC');
    setDepartments(data);
  };
  const getPartner = async () => {
    const data = await PartnerAPI.getPartnersByPageOrder(1, 100, 'ASC');
    setPartner(data);
  };
  return (
    <Form form={formdulieu} layout="vertical">
      <Card title="Thông tin dự án" bordered={false}>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="ProjectName"
              label="Tên dự án"
              rules={RULES_FORM.required}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="DepartmentId"
              label="Đơn vị thực hiện"
              rules={RULES_FORM.required}
            >
              <Select
                options={departments.map((department: any) => ({
                  label: department.DepartmentName,
                  value: department.DepartmentId,
                }))}
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item name="PartnerId" label="Tên đối tác">
              <Select
                options={partners.map((partner: any) => ({
                  label: partner.PartnerName,
                  value: partner.Id,
                }))}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="ProjectStatus"
              label="Trạng thái dự án"
              rules={RULES_FORM.required}
            >
              <Select>
                <Select.Option key="1" value="Chưa bắt đầu">
                  Chưa bắt đầu
                </Select.Option>
                <Select.Option key="2" value="Đang thực hiện">
                  Đang thực hiện
                </Select.Option>
                <Select.Option key="3" value="Đã kết thúc">
                  Đã kết thúc
                </Select.Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="ProjectStartDate"
              label="Ngày bắt đầu"
              rules={RULES_FORM.required}
            >
              <Input type="Date" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="ProjectEndDate" label="Ngày kết thúc">
              <Input type="Date" />
            </Form.Item>
          </Col>
        </Row>
        <Form.Item name="Description" label="Mô tả" rules={RULES_FORM.required}>
          <TextArea />
        </Form.Item>
      </Card>
    </Form>
  );
};

export default ProjectForm;
