import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { UserSenderMessage } from '../../message/message.dto';

@Schema({ collection: 'Conversation', timestamps: true })
export class Conversation {
  @Prop({ required: true })
  conversation_type: string;

  @Prop({ required: true })
  participants: UserSenderMessage[];

  @Prop()
  lastMessage: string;

  @Prop()
  lastMessageSendAt: Date;

  @Prop({ default: 'default' })
  topic: string;
}

const ConversationSchema = SchemaFactory.createForClass(Conversation);
export const ConversationModel = {
  name: Conversation.name,
  schema: ConversationSchema,
};
