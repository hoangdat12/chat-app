import { UserJoinChat } from 'src/message/message.dto';

export class GroupDTO {
  id: string;

  creators: UserJoinChat[];

  participants: UserJoinChat[];

  lastMessage: string | null;

  lastMessageSendAt: Date | null;

  topic: string | null;

  nameGroup: string | null;
}
