// src/hooks/useNotification.ts
import { App } from 'antd';
import type { NotificationArgsProps } from 'antd';

interface NotificationProps {
  result: any;
  messageDone?: string;
  messageError?: string;
}

export const useNotification = () => {
  const { notification } = App.useApp();

  const notificationConfig: NotificationArgsProps = {
    message: 'Thông báo',
    duration: 3,
    style: {
      width: '400px',
      height: 'auto',
    },
    placement: 'topRight',
  };

  const show = ({
    result,
    messageDone = 'Thao tác thành công',
    messageError = 'Thao tác thất bại',
  }: NotificationProps) => {
    debugger;
    if (result === 0) {
      notification.success({
        ...notificationConfig,
        description: messageDone,
      });
    }

    if (result === 1) {
      notification.error({
        ...notificationConfig,
        description: messageError,
      });
    }
  };

  return { show };
};
