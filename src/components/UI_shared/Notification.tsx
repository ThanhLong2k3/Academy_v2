import React from 'react';
import { notification } from 'antd';
import { ArgsProps } from 'antd/es/notification';
import { App } from 'antd';
interface CustomNotificationProps {
  result: any;
  MessageDone?: string;
  MessageError?: string;
}

export const CustomNotification: React.FC<CustomNotificationProps> = ({
  result,
  MessageDone = 'Thao tác thành công',
  MessageError = 'Thao tác thất bại',
}) => {
  const notificationConfig: ArgsProps = {
    message: 'Thông báo',
    duration: 3,
    style: {
      width: '400px',
      height: 'auto',
    },
    placement: 'topRight',
  };
  debugger;
  if (result === 0) {
    notification.error({
      ...notificationConfig,
      message: 'Thông báo',
      description: MessageDone,
    });
    return null;
  }
  if (result === 1) {
    notification.success({
      ...notificationConfig,
      message: 'Thông báo',
      description: MessageError,
    });
    return null;
  }
};

export default CustomNotification;
