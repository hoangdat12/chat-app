export interface IFriend {
  userId: string;
  email: string;
  userName: string;
  avatarUrl: string;
}

export interface IFriendResponse {
  friends: IFriend[];
  mutualFriends: number;
}

export interface IAddFriendResponse {
  status: string;
  data: IFriendResponse;
}

export interface ICheckFriendResponse {
  isFriend: boolean;
  unFriended: boolean;
  waitConfirm: boolean;
  confirm: boolean;
}

export interface IUnConfirmedResonse {
  unconfirmed: IFriend;
}
