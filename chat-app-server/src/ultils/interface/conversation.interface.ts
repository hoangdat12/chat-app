import { PayloadCreateConversation } from '../../conversation/conversation.dto';
import { ConversationRepository } from '../../conversation/conversation.repository';
import { MessageRepository } from '../../message/message.repository';
import { UserJoinChat } from '../../message/message.dto';
import { Messages } from 'src/schema/model/message.model';
import { ObjectId } from 'mongoose';

export interface IConstructorConversation extends PayloadCreateConversation {
  conversationId: string | null;
  conversationRepository: ConversationRepository;
  messageRepository: MessageRepository;
}

export interface IParticipant extends UserJoinChat {
  isReadLastMessage?: boolean;
}

export interface IPayloadCreateConversation {
  conversation_type: string;
  participants: IParticipant[];
}

export interface IPayloadCreateGroup {
  conversation_type: string;
  participants: IParticipant[];
  lastMessage: string | null;
  lastMessageSendAt: Date | null;
  creators: UserJoinChat[] | null;
  name: string | null;
}

export interface IMessage extends Messages {
  _id: string;
}

export interface MessagesDocument
  extends Document,
    Omit<Messages & { _id: ObjectId }, '_id'> {}
