import {
  IDataChangePostMode,
  IPagination,
  IPost,
  IResponse,
} from '../../ultils/interface';
import myAxios from '../../ultils/myAxios';

const createNewPost = async (data: FormData): Promise<IResponse<IPost>> => {
  const res = await myAxios.post('/post', data);
  return res;
};

const getPostOfUser = async (
  userId: string,
  pagiantion?: IPagination
): Promise<IResponse<IPost[]>> => {
  const { page = 1, limit = 10, sortedBy = 'ctime' } = pagiantion || {};
  const res = await myAxios.get(
    `/post/${userId}?page=${page}&limit=${limit}&sortBy=${sortedBy}`
  );
  return res;
};

const getPostSaveOfUser = async (
  userId: string
): Promise<IResponse<IPost[]>> => {
  const res = await myAxios.get(`/post/save/${userId}`);
  return res;
};

const likePost = async (
  postId: string,
  quantity: number
): Promise<IResponse<IPost>> => {
  const res = await myAxios.post(`/post/like/${postId}`, { quantity });
  return res;
};

const checkLikePost = async (postId: string): Promise<IResponse<IPost>> => {
  const res = await myAxios.get(`/post/like/liked/${postId}`);
  return res;
};

const changePostMode = async (
  data: IDataChangePostMode
): Promise<IResponse<IPost>> => {
  const { postId, post_mode } = data;
  const res = await myAxios.patch(`/post/change-mode/${postId}`, { post_mode });
  return res;
};

const getPostOfFriend = async () => {
  const res = await myAxios.get('/post/friends');
  return res;
};

const getAllPost = async (pagiantion?: IPagination) => {
  const { limit = 20, page = 1, sortedBy = 'ctime' } = pagiantion || {};
  const res = await myAxios.get(
    `/post/all?page=${page}&limit=${limit}&sortBy=${sortedBy}`
  );
  return res;
};

const deletePost = async (postId: string) => {
  const res = await myAxios.delete(`/post/${postId}`);
  return res;
};

export const postService = {
  createNewPost,
  getPostOfUser,
  getPostSaveOfUser,
  getPostOfFriend,
  likePost,
  checkLikePost,
  changePostMode,
  getAllPost,
  deletePost,
};
