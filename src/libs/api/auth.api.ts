import { CallApi } from '@/libs/call_API';
import storage from '@/utils/storage';

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
      const data = await CallApi.create<LoginResponse>('auth/login', {
        email,
        password,
      });
      storage.setStorage('ACCESS_TOKEN', data.token);
      storage.setStorage('ROLE', data.user.role);
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
    storage.clearStorage('ACCESS_TOKEN');
    storage.clearStorage('ROLE');
  },
};
