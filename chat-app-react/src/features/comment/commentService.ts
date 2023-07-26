import {
  IComment,
  IDataCreateComment,
  IDataGetListComment,
  IDataGetListCommentResponse,
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

export const commentService = {
  createComment,
  getListComment,
};
