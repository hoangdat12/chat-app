import { IsNotEmpty } from 'class-validator';
import { ConversationDTO } from 'src/schema/dto/ConversationDTO';
import { GroupDTO } from 'src/schema/dto/GroupDTO';

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
  message_type_model: ConversationDTO | GroupDTO;
  message_received: Received | Received[] | null;
}

export class CreateMessageData {
  @IsNotEmpty()
  message_type: string;

  @IsNotEmpty()
  message_content: string;

  @IsNotEmpty()
  conversationId: string;

  @IsNotEmpty()
  message_received: UserSenderMessage;
}
