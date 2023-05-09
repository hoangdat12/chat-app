import { IsNotEmpty } from 'class-validator';
import { UserJoinChat } from '../message/message.dto';
import { IParticipant } from '../schema/model/conversation.model';

export interface IInforUserChangeNickname {
  userId: string;
  userName: string;
}

export class PayloadCreateConversation {
  @IsNotEmpty()
  conversation_type: string;

  @IsNotEmpty()
  participants: IParticipant[];
  lastMessage: string | null;
  lastMessageSendAt: Date | null;
  creators: UserJoinChat[] | null;
  name?: string | null;
  avatarUrl?: string;
}

export class GetDeleteMessageOfConversation {
  @IsNotEmpty()
  conversationType: string;

  @IsNotEmpty()
  conversationId: string;
}

export class PayloadDeletePaticipant {
  @IsNotEmpty()
  conversationId: string;

  @IsNotEmpty()
  paticipantId: string;
}

export class PayloadAddPaticipant {
  @IsNotEmpty()
  conversationId: string;

  @IsNotEmpty()
  paticipant: UserJoinChat;
}

export class ChangeTopic extends GetDeleteMessageOfConversation {
  @IsNotEmpty()
  topic: string;
}

export class ChangeNickNameOfParticipant extends GetDeleteMessageOfConversation {
  @IsNotEmpty()
  newNicknameOfUser: IInforUserChangeNickname[];
}

export class RenameGroup extends GetDeleteMessageOfConversation {
  @IsNotEmpty()
  nameGroup: string;
}
