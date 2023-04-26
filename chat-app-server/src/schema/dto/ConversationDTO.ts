import { IParticipant } from '../model/conversation.model';

export class ConversationDTO {
  id: string;

  participants: IParticipant[];

  lastMessage: string | null;

  lastMessageSendAt: Date | null;

  topic: string | null;
}
