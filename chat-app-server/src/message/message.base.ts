import { Injectable } from '@nestjs/common';

export interface UserSenderMessage {
  email: string;
  firstName: string;
  lastName: string;
  avatar_url: string;
}

@Injectable()
export class BaseMessage {
  message_content: string;
  message_sender_by: UserSenderMessage;

  constructor(message_content: string, message_sender_by: UserSenderMessage) {
    this.message_content = message_content;
    this.message_sender_by = message_sender_by;
  }
}
