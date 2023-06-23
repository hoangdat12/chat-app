export interface IDataGetMessageOfConversation {
  conversation_type: string;
  conversationId: string;
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

export interface IMessageInitialState {
  messages: IMessage[];
  isLoading: boolean;
  status: 'idle' | 'pending' | 'succeeded' | 'failed';
}

export interface IDeleteMessage {
  messageId: string;
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
  lastMessage: string;
  lastMessageSendAt: string;
  nameGroup: string;
  updatedAt: string;
  userId: string[];
  collection: string;
}

export interface IMyConversation extends IConversation {
  messages: IMessage;
}

export interface IInitialStateConversation {
  conversations: Map<string, IConversation>;
  isLoading: boolean;
  status: 'idle' | 'pending' | 'succeeded' | 'failed';
}

export interface IDataUpdateLastMessage {
  conversation: IConversation;
  lastMessage: string;
  lastMessageSendAt: string;
}
