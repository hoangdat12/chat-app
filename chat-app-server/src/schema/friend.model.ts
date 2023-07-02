import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { User } from './user.model';
import { IFriend } from '../ultils/interface/friend.interface';

@Schema({ collection: 'Friend', timestamps: true })
export class Friend {
  @Prop({ type: Types.ObjectId, ref: 'User' })
  user: User;

  @Prop({ default: [] })
  friends: IFriend[];

  @Prop({ default: [] })
  unconfirmed: IFriend[];
}
const FriendSchema = SchemaFactory.createForClass(Friend);

FriendSchema.index({
  'friends.userName': 1,
});

export const FriendModel = {
  name: Friend.name,
  schema: FriendSchema,
};
