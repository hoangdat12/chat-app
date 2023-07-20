import { IUser } from '.';

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
  post_tag: FriendTag[];
  createdAt: string;
  updatedAt: string;
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
