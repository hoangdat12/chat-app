import { IResponse } from '../../ultils/interface';
import {
  IAddFriendResponse,
  ICheckFriendResponse,
  IDataGetFriendOnline,
  IFriend,
} from '../../ultils/interface/friend.interface';
import myAxios from '../../ultils/myAxios';

const getFriendOfUser = async (
  userId: string
): Promise<IResponse<IFriend[]>> => {
  const res = await myAxios.get(`/friend/${userId}`);
  return res;
};

const addFriend = async (
  friendId: string
): Promise<IResponse<IAddFriendResponse>> => {
  const res = await myAxios.post('/friend/add', { friendId });
  return res;
};

const confirmFriend = async (friendId: string): Promise<IResponse<IFriend>> => {
  const res = await myAxios.post('/friend/confirm', { friendId });
  return res;
};

const refuseFriend = async (friendId: string): Promise<IResponse<string>> => {
  const res = await myAxios.post('/friend/refuse', { friendId });
  return res;
};

const statusFriend = async (
  friendId: string
): Promise<IResponse<ICheckFriendResponse>> => {
  const res = await myAxios.get(`/friend/status/${friendId}`);
  return res;
};

const searchFriendByUserName = async (
  keyword: string
): Promise<
  IResponse<{
    friends: IFriend[];
    keyword: string;
  }>
> => {
  const res = await myAxios.get(`/friend/search?q=${keyword.trim()}`);
  return res;
};

const searchFriendOnlOffByUserName = async (
  keyword: string
): Promise<IResponse<IDataGetFriendOnline>> => {
  const res = await myAxios.get(`/friend/search/status?q=${keyword.trim()}`);
  return res;
};

const deleteFriend = async (friendId: string) => {
  const res = await myAxios.delete(`/friend/${friendId}`);
  return res;
};

const getListRequestAddFriend = async () => {
  const res = await myAxios.get(`/friend/request`);
  return res;
};

const getListPendingAddFriend = async () => {
  const res = await myAxios.get(`/friend/pending`);
  return res;
};

const findFriendOnlineAndOffline = async (
  userId: string
): Promise<IResponse<IDataGetFriendOnline>> => {
  const res = await myAxios.get(`/friend/all/status/${userId}`);
  return res;
};

export const friendService = {
  getFriendOfUser,
  addFriend,
  statusFriend,
  confirmFriend,
  refuseFriend,
  searchFriendByUserName,
  getListRequestAddFriend,
  getListPendingAddFriend,
  findFriendOnlineAndOffline,
  searchFriendOnlOffByUserName,
  deleteFriend,
};
