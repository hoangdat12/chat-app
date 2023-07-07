import { ILoginData } from '../../pages/authPage/Login';
import { IRegisterData } from '../../pages/authPage/Register';
import { IDataLoginSuccess, IDataReceived } from '../../ultils/interface';
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

export const register = async (data: IRegisterData) => {
  const response = await myAxios.post('/auth/register', data);
  return response.data;
};

export const logout = async () => {
  const res = await myAxios.post('/auth/logout');
  if (res.status === 200) {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
  }
  return res.data;
};

export const authService = {
  login,
  getInforUserWithOauth2,
  register,
};
