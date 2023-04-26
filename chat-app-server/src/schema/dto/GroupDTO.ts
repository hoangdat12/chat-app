import { UserJoinChat } from '../../message/message.dto';
import { IParticipant } from '../model/conversation.model';

export class GroupDTO {
  id: string;

  creators: UserJoinChat[];

  participants: IParticipant[];

  lastMessage: string | null;

  lastMessageSendAt: Date | null;

  topic: string | null;

  nameGroup: string | null;
}
