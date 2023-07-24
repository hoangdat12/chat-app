import { IsNotEmpty } from 'class-validator';
import { IPost } from '../ultils/interface';

export class DataCreatePost {
  post_content: string;
  @IsNotEmpty()
  post_type: string;
  @IsNotEmpty()
  post_mode: string;
  post_share: IPost | null;
}

export class IDataUpdatePost {
  post_image: string;
  post_content: string;
}
