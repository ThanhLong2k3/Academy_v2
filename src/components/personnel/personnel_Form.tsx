import React, { useEffect } from 'react';
import {
  Form,
  Input,
  FormInstance,
  Row,
  Col,
  Select,
  Upload,
  Button,
} from 'antd';
import { RULES_FORM } from '@/utils/validator';
import { GetDivision } from '@/models/division.model';
import { GetPosition } from '@/models/position.model';
import TextArea from 'antd/es/input/TextArea';
import { UploadOutlined } from '@ant-design/icons';

interface ReusableFormProps {
  formdata: FormInstance<any> | undefined;
  positions: GetPosition[];
  divisions: GetDivision[];
}

export const PersonnelForm: React.FC<ReusableFormProps> = ({
  formdata,
  positions,
  divisions,
}) => {
  const normFile = (e: any) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList || [];
  };

  return (
    <Form form={formdata} layout="vertical">
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            name="PersonnelName"
            label="Tên nhân sự"
            rules={RULES_FORM.department_name}
          >
            <Input />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="DivisionId"
            label="Tên bộ phận"
            rules={RULES_FORM.required}
          >
            <Select
              options={divisions.map((di) => ({
                label: di.DivisionName,
                value: di.Id,
              }))}
            />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            name="PositionId"
            label="Chức vụ"
            rules={RULES_FORM.required}
          >
            <Select
              options={positions.map((po) => ({
                label: po.PositionName,
                value: po.Id,
              }))}
            />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item name="DateOfBirth" label="Ngày sinh">
            <Input type="Date" />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            name="JoinDate"
            label="Ngày tham gia"
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
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item name="Email" label="Email" rules={RULES_FORM.email}>
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
      <Form.Item
        name="WorkStatus"
        label="Trạng thái "
        rules={RULES_FORM.required}
      >
        <Select>
          <Select.Option key="1" value="Đang làm việc">
            Đang làm việc
          </Select.Option>
          <Select.Option key="2" value="Đã nghỉ việc">
            Đã nghỉ việc
          </Select.Option>
        </Select>
      </Form.Item>
      <Row gutter={16}>
        <Col span={24}>
          <Form.Item
            name="Picture"
            label="Ảnh đại diện"
            valuePropName="fileList"
            getValueFromEvent={normFile}
          >
            <Upload
              listType="picture"
              maxCount={1}
              beforeUpload={() => false} // Ngăn tải lên tự động
            >
              <Button icon={<UploadOutlined />}>Tải ảnh lên</Button>
            </Upload>
          </Form.Item>
        </Col>
      </Row>
      <Form.Item name="Description" label="Mô tả" rules={RULES_FORM.required}>
        <TextArea />
      </Form.Item>
    </Form>
  );
};
