'use client';
import { useCallback, useMemo } from 'react';
import { ConfigProvider } from 'antd';
import Image from 'next/image';
import {
  UserOutlined,
  ProjectOutlined,
  SettingOutlined,
  TeamOutlined,
  UsergroupAddOutlined,
  BookOutlined,
  TrophyOutlined,
  WalletOutlined,
  BankOutlined,
  FolderOutlined,
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Menu } from 'antd';
import { useRouter, usePathname } from 'next/navigation';
import { useColorState } from '@/stores/color.store';
import styles from '@/modules/shared/siderbar/siderbar';
type MenuItem = Required<MenuProps>['items'][number];

const routeMap: { [key: string]: string } = {
  '12': '/vi/position',
  '10': '/Employee',
  '1': '/Staff',
  '6': '/Projects',
  '7': '/Topics',
  '8': '/Training',
  '2': '/vi/partner',
  '3': '/Customers',
  '5': '/Products',
  '9': '/Intellectual-Property',
  '11': '/vi/department',
};

const SideBar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { themeColor } = useColorState();

  const getCurrentKey = useCallback(() => {
    const entry = Object.entries(routeMap).find(
      ([_, path]) => path === pathname,
    );
    return entry ? entry[0] : '1';
  }, [pathname]);

  const onClick: MenuProps['onClick'] = useCallback(
    (e: any) => {
      const path = routeMap[e.key];
      if (path && path !== pathname) {
        router.push(path);
      }
    },
    [router, pathname],
  );

  const sidebarItems = useMemo(
    () => [
      {
        key: 'sub1',
        label: 'Quản lý con người',
        icon: <UserOutlined />,
        children: [
          {
            key: '1',
            label: 'Quản lý nhân viên',
            icon: <TeamOutlined />,
          },
          {
            key: '2',
            label: 'Quản lý đối tác',
            icon: <UsergroupAddOutlined />,
          },
          {
            key: '3',
            label: 'Quản lý khách hàng',
            icon: <WalletOutlined />,
          },
        ],
      },
      {
        key: 'sub2',
        label: 'Quản lý phi vật thể',
        icon: <ProjectOutlined />,
        children: [
          {
            key: '5',
            label: 'Quản lý sản phẩm',
            icon: <FolderOutlined />,
          },
          {
            key: '6',
            label: 'Quản lý dự án',
            icon: <TrophyOutlined />,
          },
          {
            key: '7',
            label: 'Quản lý đề tài',
            icon: <BookOutlined />,
          },
          {
            key: '8',
            label: 'Quản lý khóa đào tạo',
            icon: <BankOutlined />,
          },
          {
            key: '9',
            label: 'Sở hữu trí tuệ',
            icon: <SettingOutlined />,
          },
        ],
      },
      {
        key: 'sub4',
        label: 'Danh Mục',
        icon: <SettingOutlined />,
        children: [
          {
            key: '12',
            label: 'Quản lý chức vụ',
            icon: <BankOutlined />,
          },
          {
            key: '10',
            label: 'Quản lý đơn vị',
            icon: <FolderOutlined />,
          },
          {
            key: '11',
            label: 'Quản lý phòng ban',
            icon: <TeamOutlined />,
          },
        ],
      },
    ],
    [],
  );

  const textColor = themeColor?.token?.colorPrimary ? '#ffffff' : '#000000';

  return (
    <div
      className="h-full flex flex-col"
      style={{
        backgroundColor: themeColor?.token?.colorPrimary || '#ffffff',
        color: textColor,
        height: '100vh',
      }}
    >
      <div
        className="flex items-center justify-center h-16 px-4"
        style={{
          backgroundColor: themeColor?.token?.colorPrimary || '#ffffff',
          color: textColor,
          borderBottom: '1px solid #f0f0f0',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Image
          src="/image/logo.png"
          alt="Logo"
          width={150}
          height={60}
          className="h-12 object-contain"
          style={{ marginLeft: '10px' }}
        />
      </div>

      <div className="flex-1 overflow-y-auto">
        <ConfigProvider
          theme={{
            token: {
              colorBgContainer: themeColor?.token?.colorPrimary || '#ffffff',
              colorText: textColor,
            },
            components: {
              Menu: {
                itemHeight: 30,
                itemColor: textColor,
                itemHoverColor: textColor,
                colorItemTextSelectedHorizontal: textColor,
              },
            },
          }}
        >
          <Menu
            onClick={onClick}
            className="h-full border-0"
            defaultOpenKeys={['sub1', 'sub2', 'sub4']}
            selectedKeys={[getCurrentKey()]}
            mode="inline"
            items={sidebarItems}
            style={{
              backgroundColor: themeColor?.token?.colorPrimary || '#ffffff',
              color: textColor,
            }}
          />
        </ConfigProvider>
      </div>
    </div>
  );
};

export default SideBar;
