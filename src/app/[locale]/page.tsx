'use client';

import type React from 'react';
import { Card, Row, Col, Typography, Divider } from 'antd';
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
import ThemeChanger from '@/modules/shared/changetheme';
import { useEffect, useState } from 'react';
import type { IStatistics } from '@/models/boasBoard.model';
import { doashBoardAPI } from '@/libs/api/doashBoard.api';

const { Title, Text } = Typography;

const styles = {
  mainStat: {
    fontSize: '28px',
    fontWeight: 'bold',
    marginBottom: '16px',
    textAlign: 'center',
    color: '#ffffff',
  },
  cardTitle: { margin: 0, color: '#ffffff' },
  statText: { color: '#ffffff', marginTop: '8px' },
  icon: { fontSize: '24px', color: '#ffffff', marginRight: '8px' },
  divider: { margin: '12px 0', borderColor: '#ffffff' },
};
const StatCard: React.FC<{
  title: string;
  icon: React.ReactNode;
  mainStat: number;
  mainLabel: string;
  subStats: { label: string; value: number }[];
  backgroundColor: string;
  height?: string | number;
}> = ({
  title,
  icon,
  mainStat,
  mainLabel,
  subStats,
  backgroundColor,
  height,
}) => (
  <Card style={{ background: backgroundColor, height: height || 'auto' }}>
    <div
      style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}
    >
      {icon}
      <Title level={4} style={styles.cardTitle}>
        {title}
      </Title>
    </div>
    <Divider style={styles.divider} />
    <div style={styles.mainStat}>
      <h1>{mainLabel}</h1>
      {mainStat}
    </div>
    {subStats.map((stat, index) => (
      <div key={index} style={styles.statText}>
        <Text style={styles.statText}>
          {stat.label}: {stat.value}
        </Text>
      </div>
    ))}
  </Card>
);

const DashboardPage: React.FC = () => {
  const [statistics, setStatistics] = useState<IStatistics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getStatistics();
  }, []);

  const getStatistics = async () => {
    try {
      const data = await doashBoardAPI.getAlldoashBoard();
      if (data && data.length > 0) {
        setStatistics(data[0]);
      } else {
        setError('Không có dữ liệu từ server!');
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setError('Không thể tải dữ liệu, vui lòng thử lại sau!');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
        }}
      >
        Đang tải...
      </div>
    );
  }

  if (error) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
        }}
      >
        {error}
      </div>
    );
  }

  if (!statistics) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
        }}
      >
        Không có dữ liệu để hiển thị
      </div>
    );
  }

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <Title level={2}>Bảng Thống Kê</Title>
        <ThemeChanger />
      </div>
      <Row gutter={[16, 16]} style={{ marginBottom: '32px' }}>
        {/* Nhân Viên */}
        <Col xs={24} sm={12} md={8} lg={6}>
          <StatCard
            title="Nhân Viên"
            icon={<UserOutlined style={styles.icon} />}
            mainStat={statistics.active_personnel}
            mainLabel="Đang làm việc"
            subStats={[
              { label: 'Tổng số nhân viên', value: statistics.total_personnel },
              { label: 'Đã nghỉ việc', value: statistics.inactive_personnel },
            ]}
            backgroundColor="rgb(88, 107, 177)"
          />
        </Col>

        {/* Đối Tác */}
        <Col xs={24} sm={12} md={8} lg={6}>
          <StatCard
            title="Đối Tác"
            icon={<TeamOutlined style={styles.icon} />}
            mainStat={statistics.active_partners}
            mainLabel="Đang hợp tác"
            subStats={[
              { label: 'Tổng số đối tác', value: statistics.total_partners },
              { label: 'Đã dừng hợp tác', value: statistics.inactive_partners },
            ]}
            backgroundColor="rgb(64, 169, 255)"
          />
        </Col>

        {/* Khách Hàng */}
        <Col xs={24} sm={12} md={8} lg={6}>
          <StatCard
            title="Khách Hàng"
            icon={<ShoppingOutlined style={styles.icon} />}
            mainStat={statistics.total_customers}
            mainLabel="Tổng số khách hàng"
            subStats={[]}
            backgroundColor="rgb(114, 46, 209)"
            height={'100%'}
          />
        </Col>

        {/* Dự Án */}
        <Col xs={24} sm={12} md={8} lg={6}>
          <StatCard
            title="Dự Án"
            icon={<ProjectOutlined style={styles.icon} />}
            mainStat={statistics.active_projects}
            mainLabel="Đang triển khai"
            subStats={[
              { label: 'Tổng số dự án', value: statistics.total_projects },
              { label: 'Đã hoàn thành', value: statistics.completed_projects },
            ]}
            backgroundColor="rgb(245, 34, 45)"
          />
        </Col>

        {/* Đề Tài */}
        <Col xs={24} sm={12} md={8} lg={6}>
          <StatCard
            title="Đề Tài"
            icon={<BookOutlined style={styles.icon} />}
            mainStat={statistics.active_topics}
            mainLabel="Đang nghiên cứu"
            subStats={[
              { label: 'Tổng số đề tài', value: statistics.total_topics },
              { label: 'Đã nghiệm thu', value: statistics.completed_topics },
            ]}
            backgroundColor="rgb(19, 194, 194)"
          />
        </Col>

        {/* Khóa Đào Tạo */}
        <Col xs={24} sm={12} md={8} lg={6}>
          <StatCard
            title="Khóa Đào Tạo"
            icon={<ReadOutlined style={styles.icon} />}
            mainStat={statistics.active_courses}
            mainLabel="Đang diễn ra"
            subStats={[
              {
                label: 'Tổng số khóa đào tạo',
                value: statistics.total_courses,
              },
              { label: 'Đã hoàn thành', value: statistics.completed_courses },
            ]}
            backgroundColor="rgb(250, 140, 22)"
          />
        </Col>

        {/* Sản Phẩm */}
        <Col xs={24} sm={12} md={8} lg={6}>
          <StatCard
            title="Sản Phẩm"
            icon={<CustomerServiceOutlined style={styles.icon} />}
            mainStat={statistics.available_products}
            mainLabel="Đang cung cấp"
            subStats={[
              { label: 'Tổng số sản phẩm', value: statistics.total_products },
              { label: 'Đã hoàn thành', value: statistics.completed_products },
            ]}
            backgroundColor="rgb(250, 173, 20)"
          />
        </Col>

        {/* Sở Hữu Trí Tuệ */}
        <Col xs={24} sm={12} md={8} lg={6}>
          <StatCard
            title="Sở Hữu Trí Tuệ"
            icon={<CopyrightOutlined style={styles.icon} />}
            mainStat={statistics.granted_ip}
            mainLabel="Đã được cấp"
            subStats={[
              {
                label: 'Tổng số bằng sáng chế/SHTT',
                value: statistics.total_ip,
              },
              { label: 'Đang xét duyệt', value: statistics.pending_ip },
            ]}
            backgroundColor="rgb(47, 84, 235)"
          />
        </Col>
      </Row>
    </div>
  );
};

export default DashboardPage;
