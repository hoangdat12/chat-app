import { IConversation, IParticipant } from '.';

export type CallInitiatePayload = {
  localStream: MediaStream;
  isCalling: boolean;
  activeConversationId: string;
  caller: IParticipant;
  receiver: IParticipant;
  // callType: CallType;
  callType: string;
};

export type CallType = 'video' | 'audio';

export type HandleCallType = 'accept' | 'reject';

export type CallPayload = {
  receiver: IParticipant;
  conversationId: string;
  caller: IParticipant;
};

export interface ICallAcceptPayload {
  caller: IParticipant;
  conversation: IConversation;
  acceptor: IParticipant;
}
