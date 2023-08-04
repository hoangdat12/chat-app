import { IUser } from '.';

export interface IDataSearchUser {
  users: IUser[];
  keyword: string;
}

export interface IDataUpdateSocialLink {
  type: string;
  social_link: string;
}

export interface IDataChangeUserInformation {
  firstName: string | null;
  lastName: string | null;
  job: string | null;
}
