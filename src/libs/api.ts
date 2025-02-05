import axios from 'axios';
import { ACCESS_TOKEN, BASE_URL, ROLE } from '@/constants/config';
import storage from '@/utils/storage';

export const apiClient = axios.create({
    baseURL: BASE_URL,
    // timeout: 10000,
    timeout: 1000 * 60 * 30 * 3, // 90 minutes,
    withCredentials: true,
});

apiClient.interceptors.request.use(
    (config) => {
        config.headers.Authorization =
            'Bearer ' + storage.getStorage(ACCESS_TOKEN);
        config.headers.Role = storage.getStorage(ROLE);
        return config;

    },
    (error) => {
        return Promise.reject(error);
    },
);

apiClient.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (
            (error.response.status === 422 && error?.response?.data?.detail === 'Signature has expired') ||
            error?.response?.data?.detail === 'Only access tokens are allowed' ||
            error.response.status === 401 ||
            error.response.status === 403
        ) {
            
        }
        return Promise.reject(error);
    },
);
