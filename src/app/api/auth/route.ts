import { apiClient } from '@/libs/api';
import storage from '@/utils/storage';
import { ACCESS_TOKEN, ROLE } from '@/constants/config';

interface LoginResponse {
  accessToken: string;
  role: string;
}

export const login = async (
  email: string,
  password: string,
): Promise<LoginResponse> => {
  try {
    const response = await apiClient.post<LoginResponse>('/auth/login', {
      email,
      password,
    });

    const { accessToken, role } = response.data;

    // Lưu token vào localStorage
    storage.setStorage(ACCESS_TOKEN, accessToken);
    storage.setStorage(ROLE, role);

    return response.data;
  } catch (error) {
    console.error('Login failed:', error);
    throw error;
  }
};
