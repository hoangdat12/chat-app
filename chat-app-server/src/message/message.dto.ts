import { IsNotEmpty } from 'class-validator';
import { Conversation } from '../schema/model/conversation.model';
import { Group } from 'src/schema/model/group.model';

export class Received {
  userId: string;
  email: string;
  avatarUrl: string;
  userName: string;
}

export class UserSenderMessage {
  userId: string;
  email: string;
  avatarUrl: string;
  userName: string;
}

export class PayloadCreateMessage {
  message_type: string;
  message_content: string;
  message_type_model: Group | Conversation;
  message_received: Received | Received[] | null;
}

export class ConstructorMessage {
  message_type: string | null;

  message_content?: string | null;

  conversationId: string;

  message_received?: Received | Received[] | null;
}

export class CreateMessageData {
  @IsNotEmpty()
  message_type: string;

  @IsNotEmpty()
  message_content: string;

  @IsNotEmpty()
  conversationId: string;

  @IsNotEmpty()
  message_received: Received | Received[];
}

export class DelelteMessageData {
  @IsNotEmpty()
  message_type: string;

  @IsNotEmpty()
  conversationId: string;
}

export class UpdateMessageData extends DelelteMessageData {
  message_content: string | null;
}
