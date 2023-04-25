import { IsEmail, IsNotEmpty } from 'class-validator';
import { Conversation } from '../schema/model/conversation.model';
import { Group } from 'src/schema/model/group.model';

export class UserJoinChat {
  @IsNotEmpty()
  userId: string;
  @IsNotEmpty()
  @IsEmail()
  email: string;
  @IsNotEmpty()
  avatarUrl: string;
  @IsNotEmpty()
  userName: string;
  enable?: boolean;
}

export class PayloadCreateMessage {
  message_type: string;
  message_content: string;
  message_type_model: Group | Conversation;
  message_received: UserJoinChat | UserJoinChat[] | null;
}

export class ConstructorMessage {
  message_type: string | null;

  message_content?: string | null;

  conversationId: string;

  message_received?: UserJoinChat | UserJoinChat[] | null;
}

export class CreateMessageData {
  @IsNotEmpty()
  message_type: string;

  @IsNotEmpty()
  message_content: string;

  @IsNotEmpty()
  conversationId: string;

  // @IsNotEmpty()
  // message_received: UserJoinChat | UserJoinChat[];
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
