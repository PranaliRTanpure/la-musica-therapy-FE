import axios, { type AxiosRequestConfig, type AxiosError } from 'axios';

export const AXIOS_INSTANCE = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? '/api',
});

// --- Request interceptor: attach auth token ---
AXIOS_INSTANCE.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// --- Response interceptor: central error handling ---
AXIOS_INSTANCE.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      // handle refresh / redirect to login
    }
    return Promise.reject(error);
  }
);

/**
 * This is the function orval calls for every generated endpoint.
 * It also supports request cancellation via the returned promise's .cancel().
 */
export const customInstance = <T>(
  config: AxiosRequestConfig,
  options?: AxiosRequestConfig
): Promise<T> => {
  const source = axios.CancelToken.source();
  const promise = AXIOS_INSTANCE({
    ...config,
    ...options,
    cancelToken: source.token,
  }).then(({ data }) => data);

  // @ts-expect-error attach cancel for react-query
  promise.cancel = () => source.cancel('Query was cancelled');

  return promise;
};

export default customInstance;
