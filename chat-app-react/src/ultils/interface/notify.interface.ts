import { IFriend } from '.';

export interface INotify {
  _id: string;
  user_id: string;
  notify_type: string;
  notify_link: string;
  notify_friend: IFriend;
  notify_content: string;
  notify_image: string;
  notify_readed: boolean;
}
