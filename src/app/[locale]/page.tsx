'use client';

import type React from 'react';
import { Card, Row, Col, Statistic, Typography, Divider, Progress } from 'antd';
import {
  UserOutlined,
  TeamOutlined,
  ShoppingOutlined,
  ProjectOutlined,
  BookOutlined,
  ReadOutlined,
  CustomerServiceOutlined,
  CopyrightOutlined,
} from '@ant-design/icons';

const { Title, Text } = Typography;

const DashboardPage: React.FC = () => {
  return (
    <div className="p-6" style={{ padding: '20px' }}>
      <Title level={2}>Bảng Thống Kê</Title>

      <Row gutter={[16, 16]} className="mb-8">
        {/* Nhân Viên */}
        <Col xs={24} sm={12} md={8} lg={6}>
          <Card>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                marginBottom: '12px',
              }}
            >
              <UserOutlined
                style={{
                  fontSize: '24px',
                  color: '#3f8600',
                  marginRight: '8px',
                }}
              />
              <Title level={4} style={{ margin: 0 }}>
                Nhân Viên
              </Title>
            </div>
            <Divider style={{ margin: '12px 0' }} />
            <Statistic
              title="Tổng số nhân viên"
              value={220}
              valueStyle={{ color: '#3f8600' }}
            />
            <div style={{ marginTop: '16px' }}>
              <Text>Đang làm việc: 195 (88.6%)</Text>
              <Progress percent={88.6} strokeColor="#3f8600" showInfo={false} />
            </div>
            <div style={{ marginTop: '8px' }}>
              <Text>Đã nghỉ việc: 25 (11.4%)</Text>
              <Progress percent={11.4} strokeColor="#faad14" showInfo={false} />
            </div>
          </Card>
        </Col>

        {/* Đối Tác */}
        <Col xs={24} sm={12} md={8} lg={6}>
          <Card>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                marginBottom: '12px',
              }}
            >
              <TeamOutlined
                style={{
                  fontSize: '24px',
                  color: '#1890ff',
                  marginRight: '8px',
                }}
              />
              <Title level={4} style={{ margin: 0 }}>
                Đối Tác
              </Title>
            </div>
            <Divider style={{ margin: '12px 0' }} />
            <Statistic
              title="Tổng số đối tác"
              value={35}
              valueStyle={{ color: '#1890ff' }}
            />
            <div style={{ marginTop: '16px' }}>
              <Text>Đang hợp tác: 28 (80%)</Text>
              <Progress percent={80} strokeColor="#1890ff" showInfo={false} />
            </div>
            <div style={{ marginTop: '8px' }}>
              <Text>Đã dừng hợp tác: 7 (20%)</Text>
              <Progress percent={20} strokeColor="#faad14" showInfo={false} />
            </div>
          </Card>
        </Col>

        {/* Khách Hàng */}
        <Col xs={24} sm={12} md={8} lg={6}>
          <Card>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                marginBottom: '12px',
              }}
            >
              <ShoppingOutlined
                style={{
                  fontSize: '24px',
                  color: '#13c2c2',
                  marginRight: '8px',
                }}
              />
              <Title level={4} style={{ margin: 0 }}>
                Khách Hàng
              </Title>
            </div>
            <Divider style={{ margin: '12px 0' }} />
            <Statistic
              title="Tổng số khách hàng"
              value={45}
              valueStyle={{ color: '#13c2c2' }}
            />
            <div style={{ marginTop: '16px' }}>
              <Text>Khách hàng thường xuyên: 32 (71.1%)</Text>
              <Progress percent={71.1} strokeColor="#13c2c2" showInfo={false} />
            </div>
            <div style={{ marginTop: '8px' }}>
              <Text>Khách hàng mới: 13 (28.9%)</Text>
              <Progress percent={28.9} strokeColor="#faad14" showInfo={false} />
            </div>
          </Card>
        </Col>

        {/* Dự Án */}
        <Col xs={24} sm={12} md={8} lg={6}>
          <Card>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                marginBottom: '12px',
              }}
            >
              <ProjectOutlined
                style={{
                  fontSize: '24px',
                  color: '#cf1322',
                  marginRight: '8px',
                }}
              />
              <Title level={4} style={{ margin: 0 }}>
                Dự Án
              </Title>
            </div>
            <Divider style={{ margin: '12px 0' }} />
            <Statistic
              title="Tổng số dự án"
              value={18}
              valueStyle={{ color: '#cf1322' }}
            />
            <div style={{ marginTop: '16px' }}>
              <Text>Đang triển khai: 10 (55.6%)</Text>
              <Progress percent={55.6} strokeColor="#cf1322" showInfo={false} />
            </div>
            <div style={{ marginTop: '8px' }}>
              <Text>Đã hoàn thành: 8 (44.4%)</Text>
              <Progress percent={44.4} strokeColor="#faad14" showInfo={false} />
            </div>
          </Card>
        </Col>

        {/* Đề Tài */}
        <Col xs={24} sm={12} md={8} lg={6}>
          <Card>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                marginBottom: '12px',
              }}
            >
              <BookOutlined
                style={{
                  fontSize: '24px',
                  color: '#722ed1',
                  marginRight: '8px',
                }}
              />
              <Title level={4} style={{ margin: 0 }}>
                Đề Tài
              </Title>
            </div>
            <Divider style={{ margin: '12px 0' }} />
            <Statistic
              title="Tổng số đề tài"
              value={12}
              valueStyle={{ color: '#722ed1' }}
            />
            <div style={{ marginTop: '16px' }}>
              <Text>Đang nghiên cứu: 7 (58.3%)</Text>
              <Progress percent={58.3} strokeColor="#722ed1" showInfo={false} />
            </div>
            <div style={{ marginTop: '8px' }}>
              <Text>Đã nghiệm thu: 5 (41.7%)</Text>
              <Progress percent={41.7} strokeColor="#faad14" showInfo={false} />
            </div>
          </Card>
        </Col>

        {/* Khóa Đào Tạo */}
        <Col xs={24} sm={12} md={8} lg={6}>
          <Card>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                marginBottom: '12px',
              }}
            >
              <ReadOutlined
                style={{
                  fontSize: '24px',
                  color: '#eb2f96',
                  marginRight: '8px',
                }}
              />
              <Title level={4} style={{ margin: 0 }}>
                Khóa Đào Tạo
              </Title>
            </div>
            <Divider style={{ margin: '12px 0' }} />
            <Statistic
              title="Tổng số khóa đào tạo"
              value={25}
              valueStyle={{ color: '#eb2f96' }}
            />
            <div style={{ marginTop: '16px' }}>
              <Text>Đang diễn ra: 8 (32%)</Text>
              <Progress percent={32} strokeColor="#eb2f96" showInfo={false} />
            </div>
            <div style={{ marginTop: '8px' }}>
              <Text>Đã hoàn thành: 17 (68%)</Text>
              <Progress percent={68} strokeColor="#faad14" showInfo={false} />
            </div>
          </Card>
        </Col>

        {/* Dịch Vụ */}
        <Col xs={24} sm={12} md={8} lg={6}>
          <Card>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                marginBottom: '12px',
              }}
            >
              <CustomerServiceOutlined
                style={{
                  fontSize: '24px',
                  color: '#fa8c16',
                  marginRight: '8px',
                }}
              />
              <Title level={4} style={{ margin: 0 }}>
                Dịch Vụ
              </Title>
            </div>
            <Divider style={{ margin: '12px 0' }} />
            <Statistic
              title="Tổng số dịch vụ"
              value={30}
              valueStyle={{ color: '#fa8c16' }}
            />
            <div style={{ marginTop: '16px' }}>
              <Text>Dịch vụ đang cung cấp: 25 (83.3%)</Text>
              <Progress percent={83.3} strokeColor="#fa8c16" showInfo={false} />
            </div>
            <div style={{ marginTop: '8px' }}>
              <Text>Dịch vụ đang phát triển: 5 (16.7%)</Text>
              <Progress percent={16.7} strokeColor="#faad14" showInfo={false} />
            </div>
          </Card>
        </Col>

        {/* Sở Hữu Trí Tuệ */}
        <Col xs={24} sm={12} md={8} lg={6}>
          <Card>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                marginBottom: '12px',
              }}
            >
              <CopyrightOutlined
                style={{
                  fontSize: '24px',
                  color: '#08979c',
                  marginRight: '8px',
                }}
              />
              <Title level={4} style={{ margin: 0 }}>
                Sở Hữu Trí Tuệ
              </Title>
            </div>
            <Divider style={{ margin: '12px 0' }} />
            <Statistic
              title="Tổng số bằng sáng chế/SHTT"
              value={15}
              valueStyle={{ color: '#08979c' }}
            />
            <div style={{ marginTop: '16px' }}>
              <Text>Đã được cấp: 10 (66.7%)</Text>
              <Progress percent={66.7} strokeColor="#08979c" showInfo={false} />
            </div>
            <div style={{ marginTop: '8px' }}>
              <Text>Đang xét duyệt: 5 (33.3%)</Text>
              <Progress percent={33.3} strokeColor="#faad14" showInfo={false} />
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default DashboardPage;
