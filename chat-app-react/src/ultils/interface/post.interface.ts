import { IFriend, IUser } from '.';

export interface PostMode {
  title: string;
  Icon: any;
}

export interface IPost {
  _id: string;
  user: IUser;
  post_content: string;
  post_image: string;
  post_likes: FriendTag[];
  post_type: string;
  post_mode: string;
  post_comments_num: number;
  post_likes_num: number;
  post_share_num: string;
  post_tag: IFriend[];
  createdAt: string;
  updatedAt: string;
  liked?: boolean;
  post_share: IPost;
}

export interface FriendTag {
  userId: string;
  userName: string;
  avatarUrl: string;
}

export interface IDataCreatePost {
  post_content: string;
  post_type: string;
  post_mode: string;
}

export interface IDataLikePost {
  postId: string;
  quantity: number;
}

export interface IDataChangePostMode {
  postId: string;
  post_mode: string;
}
