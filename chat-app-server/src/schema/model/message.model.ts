import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { UserJoinChat } from '../../message/message.dto';
import * as mongoose from 'mongoose';
import { Conversation } from './conversation.model';
import { Group } from './group.model';

@Schema({ collection: 'MessageConversation', timestamps: true })
export class MessageConversation {
  @Prop({ required: true, default: 'conversation' })
  message_type: string;

  @Prop({ required: true })
  message_content: string;

  @Prop({ required: true })
  message_sender_by: UserJoinChat;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Conversation',
  })
  message_conversation: Conversation;

  @Prop({ required: true })
  message_received: UserJoinChat;
}

@Schema({ collection: 'MessageGroup', timestamps: true })
export class MessageGroup {
  @Prop({ required: true, default: 'conversation' })
  message_type: string;

  @Prop({ required: true })
  message_content: string;

  @Prop({ required: true })
  message_sender_by: UserJoinChat;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Group' })
  message_group: Group;

  @Prop({ required: true })
  message_received: UserJoinChat[];
}

const MessageConversationSchema =
  SchemaFactory.createForClass(MessageConversation);
// Index
MessageConversationSchema.index({ createdAt: 1 });
MessageConversationSchema.index({
  message_conversation: 1,
  'message_received.enable': 1,
  'message_received.userId': 1,
});

export const MessageConversationModel = {
  name: MessageConversation.name,
  schema: MessageConversationSchema,
};

const MessageGroupSchema = SchemaFactory.createForClass(MessageGroup);
// Index
MessageGroupSchema.index({ createdAt: 1 });
MessageGroupSchema.index({
  message_group: 1,
  'message_received.enable': 1,
  'message_received.userId': 1,
});
export const MessageGroupModel = {
  name: MessageGroup.name,
  schema: MessageGroupSchema,
};
