import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { UserJoinChat } from '../../message/message.dto';

@Schema({ collection: 'Group', timestamps: true })
export class Group {
  @Prop({ required: true })
  conversation_type: string;

  @Prop({ required: true })
  creators: UserJoinChat[];

  @Prop({ required: true })
  participants: UserJoinChat[];

  @Prop()
  lastMessage: string;

  @Prop()
  lastMessageSendAt: Date;

  @Prop()
  nameGroup: string;

  @Prop({ default: 'default' })
  topic: string;
}

const GroupSchema = SchemaFactory.createForClass(Group);
export const GroupModel = {
  name: Group.name,
  schema: GroupSchema,
};
