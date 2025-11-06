import axios from 'axios';
import type { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import { ApiError, ApiErrorSchema } from '../../types/api';

const baseURL = import.meta.env.VITE_API_BASE_URL;

if (!baseURL) {
  // eslint-disable-next-line no-console
  console.warn('[API] La variable de entorno VITE_API_BASE_URL no está definida.');
}

const apiClient = axios.create({
  baseURL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json'
  }
});

const logRequest = (config: AxiosRequestConfig) => {
  const method = config.method?.toUpperCase() ?? 'GET';
  const url = `${config.baseURL ?? ''}${config.url ?? ''}`;
  // eslint-disable-next-line no-console
  console.info(`[API] → ${method} ${url}`, config);
  return config;
};

const logResponse = (response: AxiosResponse) => {
  const { config, status } = response;
  const method = config.method?.toUpperCase() ?? 'GET';
  const url = `${config.baseURL ?? ''}${config.url ?? ''}`;
  // eslint-disable-next-line no-console
  console.info(`[API] ← ${method} ${url} ${status}`, response.data);
  return response;
};

const logError = (error: AxiosError<ApiError>) => {
  const { config } = error;
  const method = config?.method?.toUpperCase() ?? 'GET';
  const url = `${config?.baseURL ?? ''}${config?.url ?? ''}`;
  // eslint-disable-next-line no-console
  console.error(`[API] × ${method} ${url}`, error.message, error.response?.data);
  return Promise.reject(error);
};

apiClient.interceptors.request.use(logRequest, (error) => Promise.reject(error));
apiClient.interceptors.response.use(logResponse, logError);

export const mapAxiosError = (error: AxiosError<ApiError>): ApiError => {
  const fallback: ApiError = {
    status: error.response?.status ?? 500,
    error: error.name,
    message: error.message,
    path: error.config?.url
  };

  const parsed = ApiErrorSchema.safeParse(error.response?.data);
  return parsed.success ? parsed.data : fallback;
};

export default apiClient;
