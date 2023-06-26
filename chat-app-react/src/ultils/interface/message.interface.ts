export interface IDataGetMessageOfConversation {
  conversationId: string;
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
  nameGroup: string;
  updatedAt: string;
  createdAt: string;
  userId: string[];
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

export interface IDataUpdateLastMessage {
  conversation: IConversation;
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
  message_type: string;
  message_content: string;
  conversationId: string;
  participants: IParticipant[];
}
