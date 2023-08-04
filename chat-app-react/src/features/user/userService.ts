import { IResponse, IUser } from '../../ultils/interface';
import {
  IDataChangeUserInformation,
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
): Promise<IResponse<IUser>> => {
  const res = await myAxios.patch('/user/update/social-link', data);
  if (res.status === 200) {
    // Update localstore
    localStorage.setItem('user', JSON.stringify(res.data.metaData));
  }
  return res;
};

const changeUserInformation = async (
  data: IDataChangeUserInformation
): Promise<IResponse<IUser>> => {
  const res = await myAxios.patch('/user/update/user-information', data);
  if (res.status === 200) {
    // Update localstore
    localStorage.setItem('user', JSON.stringify(res.data.metaData));
  }
  return res;
};

export const userService = {
  findUserByName,
  updateSocialLink,
  changeUserInformation,
};
