import { ILoginData } from '../../pages/authPage/Login';
import { IRegisterData } from '../../pages/authPage/Register';
import {
  IDataChangePassword,
  IDataLoginSuccess,
  IDataReceived,
  IResponse,
  IUser,
} from '../../ultils/interface';
import myAxios from '../../ultils/myAxios';

const login = async (data: ILoginData) => {
  const response = (await myAxios.post(
    '/auth/login',
    data
  )) as IDataReceived<IDataLoginSuccess>;
  if (response.data.status === 200) {
    localStorage.setItem('user', JSON.stringify(response.data.metaData.user));
    localStorage.setItem('token', JSON.stringify(response.data.metaData.token));
    localStorage.setItem(
      'refreshToken',
      JSON.stringify(response.data.metaData.refreshToken)
    );
  }
  return response.data.metaData;
};

const getInforUserWithOauth2 = async () => {
  const response = (await myAxios.get('/auth/status', {
    withCredentials: true,
  })) as IDataReceived<IDataLoginSuccess>;
  if (response.data.status === 200) {
    localStorage.setItem('user', JSON.stringify(response.data.metaData.user));
    localStorage.setItem('token', JSON.stringify(response.data.metaData.token));
    localStorage.setItem(
      'refreshToken',
      JSON.stringify(response.data.metaData.refreshToken)
    );
  }
  return response.data.metaData;
};

const register = async (data: IRegisterData) => {
  const response = await myAxios.post('/auth/register', data);
  return response.data;
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

const verifyEmail = async (type: string): Promise<IResponse<string>> => {
  const res = await myAxios.post(`/auth/verify-email/change/${type}`);
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
};
