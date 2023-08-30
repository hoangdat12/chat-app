import axios from 'axios';
import { ILoginData } from '../../pages/authPage/Login';
import { IRegisterData } from '../../pages/authPage/Register';
import {
  IDataChangePassword,
  IDataGetPassword,
  IDataLoginSuccess,
  IResponse,
  IUser,
} from '../../ultils/interface';
import myAxios from '../../ultils/myAxios';

const login = async (
  data: ILoginData
): Promise<IResponse<IDataLoginSuccess>> => {
  try {
    const response = await axios.post(
      'http://localhost:8080/api/v1/auth/login',
      data
    );
    // const response = await myAxios.post('/auth/login', data);

    if (response.data.status === 200) {
      const { user, token, refreshToken } = response.data.metaData;

      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('token', JSON.stringify(token));
      localStorage.setItem('refreshToken', JSON.stringify(refreshToken));
    }
    return response;
  } catch (error: any) {
    throw error;
  }
};

const getInforUserWithOauth2 = async (): Promise<
  IResponse<IDataLoginSuccess>
> => {
  const response = await axios.get('http://localhost:8080/api/v1/auth/status', {
    withCredentials: true,
  });
  if (response.data.status === 200) {
    localStorage.setItem('user', JSON.stringify(response.data.metaData.user));
    localStorage.setItem('token', JSON.stringify(response.data.metaData.token));
    localStorage.setItem(
      'refreshToken',
      JSON.stringify(response.data.metaData.refreshToken)
    );
  }
  return response;
};

const register = async (data: IRegisterData) => {
  const response = await axios.post(
    'http://localhost:8080/api/v1/auth/register',
    data
  );
  return response;
};

const logout = async () => {
  const res = await myAxios.post('/auth/logout');
  if (res.status === 200) {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
  }
  return res.data;
};

const verifyEmail = async (
  type: string,
  email?: string
): Promise<IResponse<string>> => {
  const res = await myAxios.post(`/auth/verify-email/change/${type}`, {
    email,
  });
  return res;
};

const verifyPassword = async (
  data: ILoginData
): Promise<IResponse<{ isValid: boolean }>> => {
  const res = await myAxios.post(`/auth/verify-password`, data);
  return res;
};

const changePassword = async (
  data: IDataChangePassword
): Promise<IResponse<string>> => {
  const res = await myAxios.patch('/auth/change-password', data);
  return res;
};

const changeEmail = async (email: string): Promise<IResponse<IUser>> => {
  const res = await myAxios.patch('/auth/change-email', { email });
  if (res.status === 200) {
    localStorage.setItem('user', JSON.parse(res.data.metaData));
  }
  return res;
};

const lockedAccount = async (data: ILoginData): Promise<IResponse<string>> => {
  const res = await myAxios.post('/auth/locked-account', data);
  return res;
};

const getPassword = async (
  data: IDataGetPassword
): Promise<IResponse<string>> => {
  const res = await myAxios.patch('/auth/get-password', data);
  return res;
};

export const authService = {
  login,
  getInforUserWithOauth2,
  register,
  logout,
  changePassword,
  verifyEmail,
  verifyPassword,
  changeEmail,
  lockedAccount,
  getPassword,
};
