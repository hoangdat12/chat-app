import { IsEmail, IsNotEmpty } from 'class-validator';
import { IParticipant } from 'src/ultils/interface';

export class UserJoinChat {
  @IsNotEmpty()
  userId: string;
  @IsNotEmpty()
  @IsEmail()
  email: string;
  @IsNotEmpty()
  avatarUrl: string;
  @IsNotEmpty()
  userName: string;
  enable?: boolean;
}

export class PayloadCreateMessage {
  message_type: string;
  message_content: string;
  conversationId: string;
  message_received: UserJoinChat[];
}

export class CreateMessageData {
  message_type: string;

  @IsNotEmpty()
  message_content: string;

  @IsNotEmpty()
  conversationId: string;

  participants: IParticipant[];
}

export class DelelteMessageData {
  message_type: string;

  @IsNotEmpty()
  conversationId: string;

  @IsNotEmpty()
  message_id: string;
}

export class UpdateMessageData extends CreateMessageData {
  @IsNotEmpty()
  message_id: string;
}
