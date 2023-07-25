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
}

export interface IDataLoginSuccess {
  user: IUser;
  token: string;
  refreshToken: string;
}
