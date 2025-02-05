'use client';

import { Flex } from 'antd';
import styles from './Header.module.scss';
import LanguagesSwitcher from '../languages-switcher/LanguagesSwitcher';

const Header = () => {
  return (
    <>
      <div className={styles.header}>
        <div className={styles.topbar}>
          <div className="layout-client">
            <Flex
              className={styles.inner}
              align="center"
              justify="space-between"
            >
              {/* <LanguagesSwitcher /> */}

              <div>HỆ THỐNG QUẢN LÝ TÀI SẢN ACADEMY</div>
              <div>Thanh Long 2k3@</div>
            </Flex>
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;
