import { IsNotEmpty } from 'class-validator';
import { UserJoinChat } from '../message/message.dto';
import { IParticipant } from '../ultils/interface';

export class IInforUserChangeNickname {
  @IsNotEmpty()
  userId: string;
  @IsNotEmpty()
  userName: string;
}

export class PayloadCreateConversation {
  @IsNotEmpty()
  conversation_type: string;

  @IsNotEmpty()
  participants: IParticipant[];
  creators: UserJoinChat[] | null;
  nameGroup?: string | null;
  avatarUrl?: string;
}

export class GetDeleteMessageOfConversation {
  @IsNotEmpty()
  conversationId: string;
}

export class PayloadDeletePaticipant {
  @IsNotEmpty()
  conversationId: string;

  @IsNotEmpty()
  participantId: string;
}

export class PayloadAddPaticipant {
  @IsNotEmpty()
  conversation_type: string;

  @IsNotEmpty()
  conversationId: string;

  @IsNotEmpty()
  participant: UserJoinChat;
}

export class ChangeTopic {
  @IsNotEmpty()
  topic: string;

  @IsNotEmpty()
  conversationId: string;
}

export class ChangeNickNameOfParticipant {
  @IsNotEmpty()
  newNicknameOfUser: IInforUserChangeNickname[];

  @IsNotEmpty()
  conversationId: string;
}

export class RenameGroup {
  @IsNotEmpty()
  nameGroup: string;

  @IsNotEmpty()
  conversationId: string;
}
