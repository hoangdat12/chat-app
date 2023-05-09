import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { UserJoinChat } from '../../message/message.dto';
import { IParticipant } from './conversation.model';

@Schema({ collection: 'Group', timestamps: true })
export class Group {
  @Prop({ required: true })
  conversation_type: string;

  @Prop({ required: true })
  creators: UserJoinChat[];

  @Prop({ required: true })
  participants: IParticipant[];

  @Prop()
  lastMessage: string;

  @Prop()
  lastMessageSendAt: Date;

  @Prop()
  nameGroup: string;

  @Prop()
  avatarUrl: string;

  @Prop({ default: 'default' })
  topic: string;
}

const GroupSchema = SchemaFactory.createForClass(Group);
export const GroupModel = {
  name: Group.name,
  schema: GroupSchema,
};
