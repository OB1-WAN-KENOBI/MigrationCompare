import axios from 'axios';
import { logError } from '@shared/lib/utils/logger';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || `${import.meta.env.BASE_URL}data`,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    logError(error, 'API Interceptor');
    return Promise.reject(error);
  }
);
