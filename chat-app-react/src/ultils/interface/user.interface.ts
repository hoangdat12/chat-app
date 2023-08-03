import { IUser } from '.';

export interface IDataSearchUser {
  users: IUser[];
  keyword: string;
}

export interface IDataUpdateSocialLink {
  type: string;
  social_link: string;
}
