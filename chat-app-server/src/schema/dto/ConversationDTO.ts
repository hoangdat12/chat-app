import { UserSenderMessage } from 'src/message/message.dto';

export class ConversationDTO {
  id: string;

  participants: UserSenderMessage[];

  lastMessage: string;

  lastMessageSendAt: Date;

  topic: string;
}
