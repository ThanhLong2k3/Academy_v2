import { CallApi } from '@/libs/call_API';
import storage from '@/utils/storage';
import { API_URL } from '@/libs/call_API';
interface User {
  id: number;
  email: string;
  role: 'admin' | 'user';
}

interface LoginResponse {
  token: string;
  user: User;
}

export const authAPI = {
  register: async (
    email: string,
    password: string,
    fullName: string,
  ): Promise<number> => {
    try {
      const data = await CallApi.create<number>('auth/register', {
        email,
        password,
        fullName,
      });
      return data; // Trả về userId
    } catch (error) {
      throw new Error(
        `Đăng ký thất bại: ${error instanceof Error ? error.message : 'Không xác định'}`,
      );
    }
  },

  login: async (email: string, password: string): Promise<LoginResponse> => {
    try {
      if (!email || !password) {
        throw new Error('Email và mật khẩu không được để trống');
      }

      // Tạo request đăng nhập
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      // Kiểm tra trạng thái response
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || `Lỗi đăng nhập: ${response.status}`,
        );
      }

      // Xử lý dữ liệu trả về
      const data = await response.json();

      // Lưu token và thông tin người dùng vào localStorage
      localStorage.setItem('ACCESS_TOKEN', data.token);
      localStorage.setItem('ROLE', data.user.role);
      localStorage.setItem('FullName', data.user.fullName);

      console.log('Đăng nhập thành công:', data.user.email);
      return data;
    } catch (error) {
      throw new Error(
        `Đăng nhập thất bại: ${error instanceof Error ? error.message : 'Không xác định'}`,
      );
    }
  },

  getCurrentUser: async (): Promise<User> => {
    try {
      const data = await CallApi.getAll<User>('auth/me');
      return data[0];
    } catch (error) {
      throw new Error(
        `Lấy thông tin user thất bại: ${error instanceof Error ? error.message : 'Không xác định'}`,
      );
    }
  },

  logout: () => {
    localStorage.clear();
  },
};
