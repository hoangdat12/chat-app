export interface IDataReceived<T> {
  data: {
    metaData: T;
    message: string;
    status: number;
  };
}

export interface IUser {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  avatarUrl: string;
  role: string;
  loginWith: string;
  friends?: number;
  viewer?: number;
  total_post?: number;
  job?: string;
  address?: string;
  social_github?: string;
  social_facebook?: string;
  isActive: boolean;
}

export interface IDataLoginSuccess {
  user: IUser;
  token: string;
  refreshToken: string;
}

export interface IDataGetPassword {
  newPassword: string;
  rePassword: string;
}

export interface IDataChangePassword extends IDataGetPassword {
  olderPassword: string;
}
