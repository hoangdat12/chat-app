import { IsNotEmpty } from 'class-validator';

export class DataCreateComment {
  @IsNotEmpty()
  comment_post_id: string;
  @IsNotEmpty()
  comment_content: string;
  @IsNotEmpty()
  comment_type: string;
  // @IsNotEmpty()
  comment_parent_id: string | null;
}
