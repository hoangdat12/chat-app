export interface IFriend {
  userId: string;
  email: string;
  userName: string;
  avatarUrl: string;
  isFriend?: boolean;
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

export interface IDataGetAllFriendOfUser {
  mutualFriends: IFriend[] | null;
  friends: IFriend[] | null;
}
