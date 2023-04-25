import { IsNotEmpty } from 'class-validator';
import { UserJoinChat } from 'src/message/message.dto';

export class PayloadCreateConversation {
  @IsNotEmpty()
  conversation_type: string;

  @IsNotEmpty()
  participants: UserJoinChat[];
  lastMessage: string | null;
  lastMessageSendAt: Date | null;
  creators: UserJoinChat[] | null;
  name: string | null;
}

export class GetDeleteMessageOfConversation {
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

export class PayloadAddPaticipant {
  @IsNotEmpty()
  conversationId: string;

  @IsNotEmpty()
  paticipant: UserJoinChat;
}
