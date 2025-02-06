'use client';
import '@/assets/scss/_global.scss';
import AppProvider from './AppProvider';
import Header from '@/modules/shared/header/Header';
import { Layout, ConfigProvider } from 'antd';
import SiderBar from '@/modules/shared/siderbar/siderbar';
import { App as AntApp } from 'antd';
const { Sider, Content } = Layout;

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body>
        <ConfigProvider
          theme={{
            token: {
              colorPrimary: '#6366f1',
              borderRadius: 8,
            },
          }}
        >
          <AntApp>
            <AppProvider>
              <Layout className="min-h-screen">
                <Sider
                  width="18%"
                  className="fixed left-0 top-0 h-screen overflow-y-auto"
                  style={{
                    backgroundColor: 'transparent',
                    borderRight: '1px solid rgba(0,0,0,0.06)',
                  }}
                >
                  <SiderBar />
                </Sider>
                <Layout className="ml-[280px]">
                  <Content className="p-6 min-h-[calc(100vh-64px)] bg-gray-50">
                    {children}
                  </Content>
                </Layout>
              </Layout>
            </AppProvider>
          </AntApp>
        </ConfigProvider>
      </body>
    </html>
  );
}
