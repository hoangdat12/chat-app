import { IUser } from '.';

export interface IDataGetMessageOfConversation {
  conversationId: string | undefined | null;
  page?: number;
  limit?: number;
  sortedBy?: string;
}

export interface IDataDeleteMessageOfConversation {
  conversationId: string;
  conversation_type: string | undefined;
  message_id: string;
}

export interface IDataUpdateMessageOfConversation
  extends IDataDeleteMessageOfConversation {
  message_content: string;
}

export interface IParticipant {
  userId: string;
  email: string;
  avatarUrl: string;
  userName: string;
  enable: boolean;
  isReadLastMessage: boolean;
}

// Group and Conversation
export interface IConversation {
  _id: string;
  conversation_type: string;
  participants: IParticipant[];
  lastMessage: IMessage;
  nameGroup: string | undefined;
  updatedAt: string;
  createdAt: string;
  userId: string[];
  avatarUrl: string;
  collection: string;
}

export interface IMessage {
  _id: string;
  message_content: string;
  message_conversation: string;
  message_received: IParticipant[];
  message_sender_by: IParticipant;
  message_type: string;
  createdAt: string;
  updatedAt: string;
}

export interface IAllMessageData {
  messages: IMessage[];
  limit: number;
  page: number;
  sortedBy: string;
}

export interface IPayloadUpdateLastMessage {
  conversationId: string | undefined | null;
  lastMessage: IMessage;
}

export interface IDataFormatMessage {
  user?: IParticipant;
  messages: IMessage[];
  myMessage: boolean;
  timeSendMessage: string | null;
}

export interface IDataDeleteMessage {
  conversationId: string;
  messageId: string;
}

export interface IDataCreateMessage {
  message_type: string | null | undefined;
  message_content: string;
  conversationId: string;
  participants: IParticipant[] | null | undefined;
}

export interface iSocketDeleteMessage {
  message: IMessage;
  lastMessage: IMessage;
}

export interface IPayloadReadLastMessage {
  user: IUser | null | undefined;
  conversationId: string | null | undefined;
}
