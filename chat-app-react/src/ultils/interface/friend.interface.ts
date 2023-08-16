export interface IFriend {
  _id: string;
  email: string;
  userName: string;
  avatarUrl: string;
  firstName: string;
  lastName: string;
  isFriend?: boolean;
  peerId: string;
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
  isConfirm: boolean;
  isFriend: boolean;
  isWaitConfirm: boolean;
}

export interface IUnConfirmedResonse {
  unconfirmed: IFriend;
}

export interface IDataGetAllFriendOfUser {
  mutualFriends: IFriend[] | null;
  friends: IFriend[] | null;
}

export interface IDataGetFriendOnline {
  onlineFriends: IFriend[];
  offlineFriends: IFriend[];
}
