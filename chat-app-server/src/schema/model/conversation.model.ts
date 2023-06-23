import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IParticipant } from '../../ultils/interface';

@Schema({ collection: 'Conversation', timestamps: true })
export class Conversation {
  @Prop({ required: true })
  conversation_type: string;

  @Prop({ required: true })
  participants: IParticipant[];

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
