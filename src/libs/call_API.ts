import axios from 'axios';
import { apiClient } from './api';
const API_URL = '/api';

export const CallApi = {
  getAll: async <T>(nameApi: string): Promise<T[]> => {
    try {
      const response = await apiClient.get<T[]>(`${API_URL}/${nameApi}`);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(
          `Failed to fetch ${nameApi}, status: ${error.response?.status}`,
        );
      }
      throw error;
    }
  },

  create: async <T>(nameApi: string, data: unknown): Promise<number> => {
    try {
      const response = await apiClient.post<number>(
        `${API_URL}/${nameApi}`,
        data,
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(
          `Failed to create in ${nameApi}, status: ${error.response?.status}`,
        );
      }
      throw error;
    }
  },

  update: async <T>(nameApi: string, data: unknown): Promise<number> => {
    try {
      const response = await apiClient.patch<number>(
        `${API_URL}/${nameApi}`,
        data,
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(
          `Failed to update in ${nameApi}, status: ${error.response?.status}`,
        );
      }
      throw error;
    }
  },

  delete: async <T>(nameApi: string, id: number): Promise<number> => {
    try {
      const response = await apiClient.delete<number>(`${API_URL}/${nameApi}`, {
        params: { id },
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(
          `Failed to delete in ${nameApi}, status: ${error.response?.status}`,
        );
      }
      throw error;
    }
  },
};
