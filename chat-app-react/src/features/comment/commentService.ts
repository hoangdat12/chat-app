import {
  IComment,
  IDataCreateComment,
  IDataDeleteComment,
  IDataGetListComment,
  IDataGetListCommentResponse,
  IDataUpdateComment,
  IResponse,
} from '../../ultils/interface';
import myAxios from '../../ultils/myAxios';

const createComment = async (
  data: IDataCreateComment
): Promise<IResponse<IComment>> => {
  const res = await myAxios.post('/comment', data);
  return res;
};

const getListComment = async (
  data: IDataGetListComment
): Promise<IResponse<IDataGetListCommentResponse>> => {
  const res = await myAxios.get(
    `/comment/${data.comment_post_id}${
      data.parentCommentId ? `?parentCommentId=${data.parentCommentId}` : ''
    }`
  );
  return res;
};

const updateComment = async (
  data: IDataUpdateComment
): Promise<IResponse<IComment>> => {
  const res = await myAxios.patch('/comment', data);
  return res;
};

const deleteComment = async (data: IDataDeleteComment) => {
  const res = await myAxios.delete('/comment', { data });
  return res;
};

const likeComment = async (
  data: IDataDeleteComment
): Promise<IResponse<IComment>> => {
  const res = await myAxios.post('/comment/like', data);
  return res;
};

export const commentService = {
  createComment,
  getListComment,
  updateComment,
  deleteComment,
  likeComment,
};
