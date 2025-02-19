import React, { useEffect, useState } from 'react';
import {
  Form,
  Input,
  FormInstance,
  Row,
  Col,
  DatePicker,
  Upload,
  Button,
  Select,
} from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { RULES_FORM } from '@/utils/validator';
import { GetDivision } from '@/models/division.model';
import { divisionAPI } from '@/libs/api/division.api';
import { GetPosition } from '@/models/position.model';
import { PositionAPI } from '@/libs/api/position.api';
import { useNotification } from '../../components/UI_shared/Notification';

interface ReusableFormProps {
  formdulieu: FormInstance<any> | undefined;
  isEditing: boolean;
}

export const PersonnelForm: React.FC<ReusableFormProps> = ({ formdulieu }) => {
  const [divisions, setDivisions] = useState<GetDivision[]>([]);
  const [positions, setPosition] = useState<GetPosition[]>([]);
  const { show } = useNotification();
  useEffect(() => {
    getDivision();
    getPosition();
  }, []);

  const getDivision = async () => {
    try {
      const data = await divisionAPI.getDivisionByPageOrder(1, 100, 'ASC');
      setDivisions(data);
    } catch (error) {
      console.error('Lỗi API:', error);
      show({
        result: 1,
        messageError: 'Lỗi tải danh sách phòng ban',
      });
    }
  };

  const getPosition = async () => {
    try {
      const data = await PositionAPI.getPositionsByPageOrder(1, 100, 'ASC');

      setPosition(data);
    } catch {
      show({
        result: 1,
        messageError: 'Lỗi tải danh sách chức vụ',
      });
    }
  };

  return (
    <Form form={formdulieu} layout="vertical">
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            name="PersonnelName"
            label="Tên nhân viên"
            rules={RULES_FORM.required}
          >
            <Input />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item name="DivisionId" label="Bộ phận">
            <Select
              placeholder="Chọn bộ phận"
              options={divisions.map((division: any) => ({
                label: division.DivisionName,
                value: division.Id,
              }))}
            />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item name="PositionId" label="Chức vụ">
            <Select
              placeholder="Chọn chức vụ"
              options={positions.map((position: any) => ({
                label: position.PositionName,
                value: position.Id,
              }))}
            />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item name="DateOfBirth" label="Ngày sinh">
            <Input type="Date" />
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
          <Form.Item name="PhoneNumber" label="Số điện thoại">
            <Input />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item name="JoinDate" label="Ngày vào làm">
            <Input type="Date" />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item name="EndDate" label="Ngày kết thúc">
            <Input type="Date" />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item name="WorkStatus" label="Trạng thái công việc">
            <Select placeholder="Chọn trạng thái">
              <Select.Option value="working">Đang làm việc</Select.Option>
              <Select.Option value="resigned">Đã nghỉ việc</Select.Option>
            </Select>
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col span={24}>
          <Form.Item name="Description" label="Mô tả">
            <Input.TextArea rows={3} />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col span={24}>
          <Form.Item name="Picture" label="Ảnh nhân viên">
            <Upload listType="picture" maxCount={1}>
              <Button icon={<UploadOutlined />}>Tải ảnh lên</Button>
            </Upload>
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
};
