'use client';
import '@/assets/scss/_global.scss';
import AppProvider from './AppProvider';
import Header from '@/modules/shared/header/Header';
import { Layout } from 'antd';
import SiderBar from '@/modules/shared/siderbar/siderbar';
import Footer from '@/modules/shared/footer/Footer';
import { App } from 'antd';
const { Sider, Content } = Layout;
interface RootLayoutProps {
  children: React.ReactNode;
}

const siderStyle: React.CSSProperties = {
  lineHeight: '120px',
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body>
        <AppProvider>
          <Layout style={{ minHeight: '100vh' }}>
            <Sider width="18% " style={siderStyle}>
              <SiderBar />
            </Sider>
            <Layout>
              <Header />
              <Content>
                <App> {children}</App>
              </Content>
            </Layout>
          </Layout>
        </AppProvider>
      </body>
    </html>
  );
}
