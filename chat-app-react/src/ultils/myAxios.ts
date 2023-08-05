import axios from 'axios';
import {
  clearLocalStorage,
  getRefreshTokenLocalStorageItem,
  getTokenLocalStorageItem,
  getUserLocalStorageItem,
} from '.';

const user = getUserLocalStorageItem();
const token = getTokenLocalStorageItem();
const myAxios = axios.create({
  baseURL: 'http://localhost:8080/api/v1',
  headers: {
    'x-client-id': user?._id,
  },
  withCredentials: true,
});

myAxios.interceptors.request.use(
  function (config) {
    const condition =
      config.url?.includes('/auth/login') ||
      config.url?.includes('/auth/register') ||
      config.url?.includes('/auth/refreshToken');
    if (condition) return config;
    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${token}`,
    } as any;
    return config;
  },
  function (err) {
    return Promise.reject(err);
  }
);

myAxios.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    if (error?.response?.status === 403 && !originalRequest._retry && token) {
      originalRequest._retry = true;
      try {
        const refreshToken = getRefreshTokenLocalStorageItem();
        if (!refreshToken) {
          clearLocalStorage();
          window.location.href = '/login';
          return;
        }
        const refreshResponse = await myAxios.post(
          'http://localhost:8080/api/v1/auth/refresh-token',
          {},
          {
            headers: {
              'x-refresh-token': refreshToken,
            },
          }
        );
        if (refreshResponse.status !== 200) {
          clearLocalStorage();
          window.location.href = '/login';
          return;
        }
        // Update the token and retry the original request
        localStorage.setItem(
          'token',
          JSON.stringify(refreshResponse.data.metaData.token)
        );
        localStorage.setItem(
          'refreshToken',
          JSON.stringify(refreshResponse.data.metaData.refreshToken)
        );

        originalRequest.headers.Authorization = `Bearer ${refreshResponse.data.metaData.token}`;
        console.log('refresh Token successfully!');
        return axios(originalRequest);
      } catch (refreshError) {
        console.log('Token refresh failed:', refreshError);
        clearLocalStorage();
        window.location.href = '/login';
        return;
      }
    }
    Promise.reject(error);
    return error;
  }
);

export default myAxios;
