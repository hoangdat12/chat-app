import { IUser } from '.';

export interface IComment {
  _id: string;
  comment_post_id: string;
  comment_user_id: IUser;
  comment_type: string;
  comment_content: string;
  comment_left: number;
  comment_right: number;
  comment_parent_id: string;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface IDataGetListComment {
  comment_post_id: string;
  parentCommentId?: string | null;
}

export interface IDataCreateComment extends IDataGetListComment {
  comment_type: string;
  comment_content: string;
  comment_parent_id: string | null;
}

export interface IDataGetListCommentResponse {
  parentComment: IComment;
  comments: IComment[];
  remainComment: number;
}
