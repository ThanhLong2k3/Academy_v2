"use client"

import type React from "react"
import { Card, Row, Col, Statistic, Typography } from "antd"
import { UserOutlined, ProjectOutlined, TeamOutlined, CopyrightOutlined } from "@ant-design/icons"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

const { Title } = Typography

// Dữ liệu ảo cho biểu đồ
const chartData = [
  { name: "Tháng 1", employees: 100, projects: 5, clients: 20, licenses: 15 },
  { name: "Tháng 2", employees: 120, projects: 7, clients: 25, licenses: 18 },
  { name: "Tháng 3", employees: 150, projects: 10, clients: 30, licenses: 22 },
  { name: "Tháng 4", employees: 180, projects: 12, clients: 35, licenses: 28 },
  { name: "Tháng 5", employees: 200, projects: 15, clients: 40, licenses: 32 },
  { name: "Tháng 6", employees: 220, projects: 18, clients: 45, licenses: 38 },
]

const DashboardPage: React.FC = () => {
  return (
    <div className="p-6">
      <Title level={2}>Bảng Thống Kê</Title>

      <Row gutter={16} className="mb-8">
        <Col span={6}>
          <Card>
            <Statistic title="Số Nhân Viên" value={220} prefix={<UserOutlined />} valueStyle={{ color: "#3f8600" }} />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic title="Số Dự Án" value={18} prefix={<ProjectOutlined />} valueStyle={{ color: "#cf1322" }} />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic title="Số Khách Hàng" value={45} prefix={<TeamOutlined />} valueStyle={{ color: "#1890ff" }} />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Số Bản Quyền"
              value={38}
              prefix={<CopyrightOutlined />}
              valueStyle={{ color: "#722ed1" }}
            />
          </Card>
        </Col>
      </Row>

      <Card className="mt-8">
        <Title level={4}>Biểu Đồ Tăng Trưởng 6 Tháng Gần Nhất</Title>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart
            data={chartData}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="employees" fill="#3f8600" name="Nhân Viên" />
            <Bar dataKey="projects" fill="#cf1322" name="Dự Án" />
            <Bar dataKey="clients" fill="#1890ff" name="Khách Hàng" />
            <Bar dataKey="licenses" fill="#722ed1" name="Bản Quyền" />
          </BarChart>
        </ResponsiveContainer>
      </Card>
    </div>
  )
}

export default DashboardPage

