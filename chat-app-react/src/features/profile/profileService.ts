import {
  IDataChangeUserAddress,
  IDataChangeUserInformation,
  IResponse,
} from '../../ultils/interface';
import { IProfile } from '../../ultils/interface/profile.interface';
import myAxios from '../../ultils/myAxios';

const viewProfile = async (userId: string): Promise<IResponse<IProfile>> => {
  const res = await myAxios.get(`/profile/${userId}`);
  return res;
};

const changeUserInformation = async (
  data: IDataChangeUserInformation
): Promise<IResponse<IProfile>> => {
  const res = await myAxios.patch('/profile/update/user-information', data);
  return res;
};

const changeUserAddress = async (
  data: IDataChangeUserAddress
): Promise<IResponse<IProfile>> => {
  const res = await myAxios.patch('/profile/update/user-address', data);
  return res;
};

export const profileService = {
  viewProfile,
  changeUserInformation,
  changeUserAddress,
};
