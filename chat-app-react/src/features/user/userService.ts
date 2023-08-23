import { IResponse, IUser } from '../../ultils/interface';
import {
  IDataSearchUser,
  IDataUpdateSocialLink,
} from '../../ultils/interface/user.interface';
import myAxios from '../../ultils/myAxios';

const findUserByName = async (
  keyword: string,
  page: number = 1,
  limit: number = 20
): Promise<IResponse<IDataSearchUser>> => {
  const res = await myAxios.get(
    `/user/search?q=${keyword.trim()}&page=${page}&limit=${limit}`
  );
  return res;
};

const updateSocialLink = async (
  data: IDataUpdateSocialLink
): Promise<IResponse<IDataUpdateSocialLink>> => {
  const res = await myAxios.patch('/user/update/social-link', data);
  return res;
};

const findUserByEmail = async (
  email: string
): Promise<IResponse<{ user: IUser }>> => {
  const res = await myAxios.post('/user/email', { email });
  return res;
};

const changeAvatar = async (formData: FormData): Promise<IResponse<string>> => {
  const res = await myAxios.patch('/user/change-avatar', formData);
  return res;
};

const checkUserOnline = async (
  conversationUserId: string
): Promise<IResponse<{ isOnline: boolean }>> => {
  const res = await myAxios.get(`/user/status/${conversationUserId}`);
  return res;
};

export const userService = {
  findUserByName,
  updateSocialLink,
  findUserByEmail,
  changeAvatar,
  checkUserOnline,
};
