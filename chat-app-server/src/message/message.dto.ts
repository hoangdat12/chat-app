import { Conversation } from 'src/schema/model/conversation.model';
import { Group } from 'src/schema/model/group.model';

export class Received {
  userId: string;
  email: string;
  avatarUrl: string;
  userName: string;
}

export class UserSenderMessage {
  email: string;
  firstName: string;
  lastName: string;
  avatar_url: string;
}

export class PayloadCreateMessage {
  message_type: string;
  message_content: string;
  message_sender_by: UserSenderMessage;
  message_type_model: Conversation | Group;
  message_received: Received | Received[];
}
