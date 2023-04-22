import { UserSenderMessage } from 'src/message/message.dto';

export class GroupDTO {
  id: string;

  creator: UserSenderMessage;

  participants: UserSenderMessage[];

  lastMessage: string;

  lastMessageSendAt: Date;

  nameGroup: string;

  topic: string;
}
