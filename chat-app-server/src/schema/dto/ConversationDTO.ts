import { UserJoinChat } from 'src/message/message.dto';

export class ConversationDTO {
  id: string;

  participants: UserJoinChat[];

  lastMessage: string | null;

  lastMessageSendAt: Date | null;

  topic: string | null;
}
