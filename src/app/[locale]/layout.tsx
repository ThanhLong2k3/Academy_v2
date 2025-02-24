'use client';
import '@/assets/scss/_global.scss';
import AppProvider from './AppProvider';
import { Layout, ConfigProvider } from 'antd';
import SiderBar from '@/modules/shared/siderbar/siderbar';
import { App as AntApp } from 'antd';
import { usePathname } from 'next/navigation';

const { Sider, Content } = Layout;

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  const pathname = usePathname();
  const isLoginPage = pathname === '/vi';
  const isRegisterPage = pathname === '/vi/register';
  return (
    <html lang="en">
      <body>
        <ConfigProvider>
          <AntApp>
            <AppProvider>
              <Layout className="min-h-screen">
                {!isLoginPage && (
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
                )}
                <Layout className={isLoginPage ? 'w-full' : 'ml-[280px]'}>
                  <Content className="p-6 min-h-[calc(100vh-64px)]">
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
