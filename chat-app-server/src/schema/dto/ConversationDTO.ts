import { UserSenderMessage } from 'src/message/message.dto';

export class ConversationDTO {
  id: string;

  participants: UserSenderMessage[];

  lastMessage: string | null;

  lastMessageSendAt: Date | null;

  topic: string | null;
}
