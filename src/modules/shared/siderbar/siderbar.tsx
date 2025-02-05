'use client';
import React, { useState } from 'react';
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
import type { MenuProps, MenuTheme } from 'antd';
import { Menu, Switch, Tooltip } from 'antd';
import { useRouter } from 'next/navigation';

type MenuItem = Required<MenuProps>['items'][number];

const getSidebarItems = (): MenuItem[] => [
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
];

const SiderBar = () => {
  const [theme, setTheme] = useState<MenuTheme>('dark');
  const [current, setCurrent] = useState('1');
  const router = useRouter();

  const changeTheme = (value: boolean) => {
    setTheme(value ? 'dark' : 'light');
  };

  const onClick: MenuProps['onClick'] = (e) => {
    console.log('Click menu: ', e.key);
    setCurrent(e.key);
debugger
    const routeMap: { [key: string]: string } = {
      '12': 'vi/position',
      '10': '/Employee',
      '1': '/Staff',
      '6': '/Projects',
      '7': '/Topics',
      '8': '/Training',
    };

    if (routeMap[e.key]) {
      router.push(routeMap[e.key]);
    }
  };

  return (
    <div
      className="h-screen flex flex-col"
      style={{
        width: '270px',
        boxShadow: '2px 0 8px rgba(0,0,0,0.15)',
        backgroundColor: theme === 'dark' ? '#1F2937' : '#ffffff',
        transition: 'all 0.3s ease',
      }}
    >
      {/* Logo Container */}
      <div
        className="flex items-center justify-center"
        style={{
          height: '80px',
          backgroundColor: theme === 'dark' ? '#111827' : '#ffffff',
          borderBottom: '1px solid ' + (theme === 'dark' ? '#374151' : '#E5E7EB'),
          padding: '0 20px',
        }}
      >
        <img 
          src="/image/logo.png" 
          alt="Logo" 
          style={{
            height: '60px',
            objectFit: 'contain'
          }}
        />
      </div>

      {/* Menu */}
      <Menu
        theme={theme}
        onClick={onClick}
        style={{
          flex: 1,
          padding: '12px 0',
          backgroundColor: 'transparent',
          border: 'none',
        }}
        defaultOpenKeys={['sub1', 'sub2', 'sub4']}
        selectedKeys={[current]}
        mode="inline"
        items={getSidebarItems()}
        inlineIndent={16}
      />

      {/* Theme Switch */}
      <div 
        className="flex justify-between items-center px-6 py-4"
        style={{
          borderTop: '1px solid ' + (theme === 'dark' ? '#374151' : '#E5E7EB'),
          backgroundColor: theme === 'dark' ? '#111827' : '#f8f9fa',
        }}
      >
        <span
          className="text-sm font-medium"
          style={{ 
            color: theme === 'dark' ? '#E5E7EB' : '#4B5563'
          }}
        >
          Giao Diện
        </span>
        <Tooltip
          title={theme === 'dark' ? 'Chuyển sang chế độ sáng' : 'Chuyển sang chế độ tối'}
        >
          <Switch
            checked={theme === 'dark'}
            onChange={changeTheme}
            checkedChildren="Tối"
            unCheckedChildren="Sáng"
            style={{
              backgroundColor: theme === 'dark' ? '#4B5563' : '#E5E7EB'
            }}
          />
        </Tooltip>
      </div>
    </div>
  );
};

export default SiderBar;