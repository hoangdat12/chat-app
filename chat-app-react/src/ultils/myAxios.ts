import axios from 'axios';
import { getTokenLocalStorageItem, getUserLocalStorageItem } from '.';

const user = getUserLocalStorageItem();
const token = getTokenLocalStorageItem();

const myAxios = axios.create({
  baseURL: 'http://localhost:8080/api/v1',
  headers: {
    // Authorization: `Bearer ${token}`,
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
    console.log(err);
    return Promise.reject(err);
  }
);

myAxios.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    console.log(
      originalRequest,
      (error.response.status === 401 || error?.response?.status === 403) &&
        !originalRequest._retry
    );
    if (
      (error.response.status === 401 || error?.response?.status === 403) &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      try {
        const refreshResponse = await myAxios.post(
          'http://localhost:8080/api/v1/auth/refresh-token'
        );

        const { token: newToken } = refreshResponse.data;

        // Update the token and retry the original request
        localStorage.setItem('token', JSON.stringify(newToken));

        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return axios(originalRequest);
      } catch (refreshError) {
        console.log('Token refresh failed:', refreshError);
        console.log('Logout!!!!');
      }
    }

    return Promise.reject(error);
  }
);

export default myAxios;
