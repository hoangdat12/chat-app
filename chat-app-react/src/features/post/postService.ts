import { IPost, IResponse } from '../../ultils/interface';
import myAxios from '../../ultils/myAxios';

const createNewPost = async (data: FormData): Promise<IResponse<IPost>> => {
  const res = await myAxios.post('/post', data);
  console.log(res);
  return res;
};

export const postService = {
  createNewPost,
};
