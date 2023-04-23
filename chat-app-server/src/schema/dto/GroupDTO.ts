import { UserSenderMessage } from 'src/message/message.dto';

export class GroupDTO {
  id: string;

  creator: UserSenderMessage;

  participants: UserSenderMessage[];

  lastMessage: string | null;

  lastMessageSendAt: Date | null;

  topic: string | null;

  nameGroup: string | null;
}
