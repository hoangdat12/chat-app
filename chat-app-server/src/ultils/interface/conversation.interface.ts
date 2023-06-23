import { PayloadCreateConversation } from '../../conversation/conversation.dto';
import { ConversationRepository } from '../../conversation/conversation.repository';
import { MessageRepository } from '../../message/message.repository';
import { ConstructorMessage, UserJoinChat } from '../../message/message.dto';

export interface IConstructorConversation extends PayloadCreateConversation {
  conversationId: string | null;
  conversationRepository: ConversationRepository;
  messageRepository: MessageRepository;
}

export interface Constructor extends ConstructorMessage {
  message_sender_by: UserJoinChat | null;
  messageRepository: MessageRepository | null;
  conversationRepository: ConversationRepository | null;
}

export interface IParticipant extends UserJoinChat {
  isReadLastMessage?: boolean;
}

export interface IPayloadCreateConversation {
  conversation_type: string;
  participants: IParticipant[];
  lastMessage: string | null;
  lastMessageSendAt: Date | null;
}

export interface IPayloadCreateGroup {
  conversation_type: string;
  participants: IParticipant[];
  lastMessage: string | null;
  lastMessageSendAt: Date | null;
  creators: UserJoinChat[] | null;
  name: string | null;
}
