import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Received, UserSenderMessage } from '../../message/message.dto';
import { Types } from 'mongoose';
import { Group } from './group.model';
import { Conversation } from './conversation.model';

@Schema({ collection: 'MessageConversation', timestamps: true })
export class MessageConversation {
  @Prop({ required: true, default: 'conversation' })
  message_type: string;

  @Prop({ required: true })
  message_content: string;

  @Prop({ required: true })
  message_sender_by: UserSenderMessage;

  @Prop({ type: Types.ObjectId, ref: 'Conversation' })
  message_conversation: Conversation;

  @Prop({ required: true })
  message_received: Received;
}

@Schema({ collection: 'MessageGroup', timestamps: true })
export class MessageGroup {
  @Prop({ required: true, default: 'conversation' })
  message_type: string;

  @Prop({ required: true })
  message_content: string;

  @Prop({ required: true })
  message_sender_by: UserSenderMessage;

  @Prop({ type: Types.ObjectId, ref: 'Group' })
  message_group: Group;

  @Prop({ required: true })
  message_received: Received[];
}

const MessageConversationSchema =
  SchemaFactory.createForClass(MessageConversation);
export const MessageConversationModel = {
  name: MessageConversation.name,
  schema: MessageConversationSchema,
};

const MessageGroupSchema = SchemaFactory.createForClass(MessageGroup);
export const MessageGroupModel = {
  name: MessageGroup.name,
  schema: MessageGroupSchema,
};
