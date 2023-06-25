import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { UserJoinChat } from '../../message/message.dto';
import { IParticipant } from '../../ultils/interface';
import { Conversation } from './conversation.model';

@Schema({ collection: 'Group', timestamps: true })
export class Group extends Conversation {
  @Prop({ required: true })
  creators: UserJoinChat[];

  @Prop()
  nameGroup: string;

  @Prop()
  avatarUrl: string;
}

const GroupSchema = SchemaFactory.createForClass(Group);
GroupSchema.index({ 'participants.userId': 1, 'participants.enable': 1 });
export const GroupModel = {
  name: Group.name,
  schema: GroupSchema,
};
