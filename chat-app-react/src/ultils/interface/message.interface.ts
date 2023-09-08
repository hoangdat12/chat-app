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

export interface IMessage {
  _id: string;
  message_content: string;
  message_content_type: string;
  message_conversation: string;
  message_received: IParticipant[];
  message_sender_by: IParticipant;
  message_type: string;
  createdAt: string;
  updatedAt: string;
  message_call?: IMessageCall;
}

export interface IParticipant {
  userId: string;
  email: string;
  avatarUrl: string;
  userName: string;
  enable: boolean;
  isReadLastMessage: boolean;
  peerId: string;
  receiveNotification?: boolean;
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
  creators?: IParticipant[];
  userId: string[];
  avatarUrl: string;
  collection: string;
  emoji?: string;
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
  conversationId?: string;
  participants?: IParticipant[] | null | undefined;
  message_content_type?: string;
  message_call?: IMessageCall;
  createdAt?: Date;
  message_sender_by?: IParticipant;
}

export interface IMessageCall {
  status?: string;
  time?: string;
  caller: IParticipant;
  receiver: IParticipant;
}

export interface iSocketDeleteMessage {
  message: IMessage;
  lastMessage: IMessage;
}

export interface IPayloadReadLastMessage {
  user: IUser | null | undefined;
  conversationId: string | null | undefined;
}

export interface IDataCreateNewGroup {
  nameGroup: string;
  conversation_type: string;
  participants: IParticipant[];
}

export interface IDataDeleteMember {
  conversationId: string;
  participant: IParticipant;
}

export interface IDataAddNewMember {
  conversation_type: string;
  conversationId: string;
  newParticipants: IParticipant[];
}

export interface IDataAddNewMemberResponse {
  conversationId: string;
  newMember: IParticipant[];
  lastMessage: IMessage;
}

export interface IDataDeleteMemberResponse {
  participant: IParticipant;
  conversation: IConversation;
}

export interface IDataUserLeaveGroupResponse {
  conversation: IConversation;
  user: IUser;
}

export interface IDataChangeUsernameOfConversation {
  conversationId: string;
  newUsernameOfParticipant: IParticipant;
}

export interface IDataChangeEmoji {
  conversationId: string;
  emoji: string;
}

export interface IDataChangeAvatarOfConversation {
  conversationId: string;
  file: File;
}

export interface IDataChangeNameGroup {
  conversationId: string;
  nameGroup: string;
}
