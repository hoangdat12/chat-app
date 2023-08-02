import { IPagination, IResponse } from '../../ultils/interface';
import {
  IAddFriendResponse,
  ICheckFriendResponse,
  IDataGetAllFriendOfUser,
  IFriend,
  IFriendResponse,
  IUnConfirmedResonse,
} from '../../ultils/interface/friend.interface';
import myAxios from '../../ultils/myAxios';

const getFriendOfUser = async (userId: string): Promise<IFriendResponse> => {
  const res = await myAxios.get(`/friend/friends/${userId}`);
  return res.data.metaData;
};

const getUnconfirmedFriend = async (): Promise<IUnConfirmedResonse[]> => {
  const res = await myAxios.get('/friend/uncofirmed');
  return res.data.metaData;
};

const addFriend = async (
  friend: IFriend
): Promise<IResponse<IAddFriendResponse>> => {
  const res = await myAxios.post('/friend/add', { friend });
  return res;
};

const confirmFriend = async (friend: IFriend): Promise<IFriend> => {
  const res = await myAxios.post('/friend/confirm', { friend });
  return res.data.metaData;
};

const refuseFriend = async (friend: IFriend): Promise<IFriend> => {
  const res = await myAxios.post('/friend/refuse', { friend });
  return res.data.metaData;
};

const statusFriend = async (
  friendId: string
): Promise<IResponse<ICheckFriendResponse>> => {
  const res = await myAxios.get(`/friend/status/${friendId}`);
  return res;
};

const getTotalNotifyAddFriend = async (): Promise<{ totalNotify: number }> => {
  const res = await myAxios.get(`/friend/total-notify`);
  return res.data.metaData;
};

const getAllFriendOfUser = async (
  userId: string,
  pagination?: IPagination
): Promise<IResponse<IDataGetAllFriendOfUser>> => {
  const { page = 0, limit = 20, sortedBy = 'ctime' } = pagination || {};

  const res = await myAxios.get(
    `/friend/all/${userId}?page=${page}&limit=${limit}&sortBy=${sortedBy}`
  );
  return res;
};

const searchFriendByUserName = async (
  keyword: string
): Promise<
  IResponse<{
    friends: IFriendResponse[];
    keyword: string;
  }>
> => {
  const res = await myAxios.get(`/friend/search?q=${keyword.trim()}`);
  return res;
};

const deleteFriend = async (friendId: string) => {
  const res = await myAxios.delete(`/friend/${friendId}`);
  return res;
};

export const friendService = {
  getFriendOfUser,
  addFriend,
  statusFriend,
  getTotalNotifyAddFriend,
  getUnconfirmedFriend,
  confirmFriend,
  refuseFriend,
  searchFriendByUserName,
  deleteFriend,
  getAllFriendOfUser,
};
