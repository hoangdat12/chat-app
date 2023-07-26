import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { Post } from './post.model';
import { User } from './user.model';
import { CommentType } from '../ultils/constant';
import { IUserLikePost } from 'src/ultils/interface';

@Schema({ collection: 'Comments', timestamps: true })
export class Comment {
  @Prop({ type: Types.ObjectId, ref: Post.name })
  comment_post_id: string;

  @Prop({ type: Types.ObjectId, ref: User.name })
  comment_user_id: string;

  @Prop({ default: CommentType.TEXT, enum: CommentType })
  comment_type: string;

  @Prop({ required: true })
  comment_content: string;

  @Prop({ default: 0 })
  comment_left: number;

  @Prop({ default: 0 })
  comment_right: number;

  @Prop({ type: Types.ObjectId, ref: Comment.name, default: null })
  comment_parent_id: string;

  @Prop({ default: false })
  isDeleted: boolean;

  @Prop({ default: 0 })
  comment_likes_num: number;

  @Prop({ default: [] })
  comment_likes: IUserLikePost[];
}

const CommentSchema = SchemaFactory.createForClass(Comment);
export const CommentModel = {
  name: Comment.name,
  schema: CommentSchema,
};
