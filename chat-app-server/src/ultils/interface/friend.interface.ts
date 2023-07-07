import { IUserCreated } from './auth.interface';

export interface IFriend {
  userId: string;
  email: string;
  userName: string;
  avatarUrl: string;
  createdAt?: Date;
  isWatched?: boolean;
}

export interface ISocketAddFriend {
  user: IUserCreated;
  friend: IFriend;
}
