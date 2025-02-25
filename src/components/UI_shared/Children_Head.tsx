import Link from 'next/link';
import ThemeChanger from '@/modules/shared/changetheme';
import { Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

interface HeaderProps {
  title: string;
  onAdd: () => void;
  text_btn_add: string;
}

const Header_Children: React.FC<HeaderProps> = ({
  title,
  onAdd,
  text_btn_add,
}) => {
  return (
    <>
      <div className="flex justify-between items-center mb-6 font-bold">
        <div className="flex items-center">
          <Link href="/vi/dashboard/">
            <button
              type="button"
              className="ant-btn css-c2eqey ant-btn-default flex items-center"
            >
              <span
                role="img"
                aria-label="home"
                className="anticon anticon-home"
              >
                <svg
                  viewBox="64 64 896 896"
                  focusable="false"
                  data-icon="home"
                  width="1em"
                  height="1em"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M946.5 505L560.1 118.8l-25.9-25.9a31.5 31.5 0 00-44.4 0L77.5 505a63.9 63.9 0 00-18.8 46c.4 35.2 29.7 63.3 64.9 63.3h42.5V940h691.8V614.3h43.4c17.1 0 33.2-6.7 45.3-18.8a63.6 63.6 0 0018.7-45.3c0-17-6.7-33.1-18.8-45.2zM568 868H456V664h112v204zm217.9-325.7V868H632V640c0-22.1-17.9-40-40-40H432c-22.1 0-40 17.9-40 40v228H238.1V542.3h-96l370-369.7 23.1 23.1L882 542.3h-96.1z"></path>
                </svg>
              </span>
            </button>
          </Link>
          <span className="ml-2">/ {title}</span>
        </div>
        <ThemeChanger />
      </div>

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">{title}</h1>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          className="bg-purple-600"
          onClick={onAdd}
        >
          {text_btn_add}
        </Button>
      </div>
    </>
  );
};

export default Header_Children;
