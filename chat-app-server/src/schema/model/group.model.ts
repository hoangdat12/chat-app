import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { UserSenderMessage } from '../../message/message.dto';

@Schema({ collection: 'Group', timestamps: true })
export class Group {
  @Prop({ required: true })
  creator: UserSenderMessage;

  @Prop({ required: true })
  participants: UserSenderMessage[];

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
