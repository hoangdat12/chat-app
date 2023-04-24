import { IsNotEmpty } from 'class-validator';
import { Received, UserSenderMessage } from 'src/message/message.dto';

export class PayloadCreateConversation {
  @IsNotEmpty()
  conversation_type: string;

  @IsNotEmpty()
  participants: UserSenderMessage[];
  lastMessage: string | null;
  lastMessageSendAt: Date | null;
  creators: UserSenderMessage[] | null;
  name: string | null;
}

export class GetMessageOfConversation {
  @IsNotEmpty()
  conversationType: string;

  @IsNotEmpty()
  conversationId: string;
}

export class PayloadDeletePaticipant {
  @IsNotEmpty()
  conversationId: string;

  @IsNotEmpty()
  paticipantId: string;
}
