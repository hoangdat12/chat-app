import { UserSenderMessage } from 'src/message/message.dto';

export class GroupDTO {
  id: string;

  creators: UserSenderMessage[];

  participants: UserSenderMessage[];

  lastMessage: string | null;

  lastMessageSendAt: Date | null;

  topic: string | null;

  nameGroup: string | null;
}
