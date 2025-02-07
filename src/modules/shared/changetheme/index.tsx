import { useColorState } from '@/stores/color.store';
import Image from 'next/image';
import { Flex, Dropdown } from 'antd';
import {
  UserOutlined,
  SettingOutlined,
  LogoutOutlined,
} from '@ant-design/icons';
import { useState } from 'react';
import styles from '@/modules/shared/header/Header.module.scss';

const ThemeChanger = () => {
  const { setThemeColor } = useColorState();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleMenuClick = (e: { key: string }) => {
    if (e.key === 'logout') {
      // Xử lý đăng xuất
      console.log('Đăng xuất');
    } else if (e.key === 'settings') {
      // Điều hướng đến trang cài đặt
      console.log('Đi đến trang cài đặt');
    }
    setIsMenuOpen(false);
  };

  const menuItems = [
    {
      key: 'user',
      icon: <UserOutlined />,
      label: 'Tài khoản của bạn',
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: 'Cài đặt thông tin cá nhân',
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Đăng xuất',
    },
  ];

  return (
    <div
      style={{
        display: 'flex',
        gap: '10px',
        lineHeight: '30px',
        alignItems: 'center',
      }}
    >
      <button
        onClick={() => setThemeColor({ token: { colorPrimary: '#ff4d4f' } })}
        style={{
          backgroundColor: '#ff4d4f',
          borderRadius: '50%',
          height: '15px',
          width: '15px',
          border: 'none',
          cursor: 'pointer',
        }}
      />

      <button
        onClick={() => setThemeColor({ token: { colorPrimary: '#52c41a' } })}
        style={{
          backgroundColor: '#52c41a',
          borderRadius: '50%',
          height: '15px',
          width: '15px',
          border: 'none',
          cursor: 'pointer',
        }}
      />
      <button
        onClick={() => setThemeColor({ token: { colorPrimary: '#fffffff' } })}
        style={{
          backgroundColor: '#fffffff',
          borderRadius: '50%',
          height: '15px',
          width: '15px',
          border: 'none',
          cursor: 'pointer',
        }}
      />

      <h1>/</h1>

      <Dropdown
        menu={{ items: menuItems, onClick: handleMenuClick }}
        onOpenChange={setIsMenuOpen}
        open={isMenuOpen}
        trigger={['click']}
      >
        <div className={styles.rightContent}>
          <Image
            src="/image/logo.png"
            alt="Logo"
            width={40}
            height={40}
            className="h-12 object-contain"
            style={{
              marginLeft: '10px',
              borderRadius: '50%',
              border: '1px black solid',
            }}
          />
        </div>
      </Dropdown>
    </div>
  );
};

export default ThemeChanger;
