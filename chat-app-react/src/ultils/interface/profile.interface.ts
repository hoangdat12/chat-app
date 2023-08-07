import { IUser } from '.';

export interface IAddress {
  _id: string;
  address_user: IUser;
  address_country: string;
  address_city: string;
  address_state: string;
  address_street: string;
  address_postal_code: string;
}

export interface IProfile {
  _id: string;
  profile_user: IUser;
  profile_total_friends: number;
  profile_viewer: number;
  profile_total_post: number;
  profile_job: string;
  profile_address: IAddress;
  profile_social_github: string;
  profile_social_facebook: string;
  profile_banner: string;
}
