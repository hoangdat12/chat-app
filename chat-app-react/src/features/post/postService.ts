import { IPost, IResponse } from '../../ultils/interface';
import myAxios from '../../ultils/myAxios';

const createNewPost = async (data: FormData): Promise<IResponse<IPost>> => {
  const res = await myAxios.post('/post', data);
  return res;
};

const getPostOfUser = async (userId: string): Promise<IResponse<IPost[]>> => {
  const res = await myAxios.get(`/post/${userId}`);
  return res;
};

const getPostSaveOfUser = async (
  userId: string
): Promise<IResponse<IPost[]>> => {
  const res = await myAxios.get(`/post/save/${userId}`);
  console.log(res);
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

export const postService = {
  createNewPost,
  getPostOfUser,
  getPostSaveOfUser,
  likePost,
  checkLikePost,
};
