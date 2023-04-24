import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Constructor, MessageFactory } from './message.base';
import { MessageRepository } from './message.repository';
import { IUserCreated } from '../auth/repository/auth.repository';
import {
  CreateMessageData,
  DelelteMessageData,
  UpdateMessageData,
} from './message.dto';
import { ConversationRepository } from '../conversation/conversation.repository';

@Injectable()
export class MessageService {
  constructor(
    private readonly messageFactory: MessageFactory,
    private readonly messageRepository: MessageRepository,
    private readonly conversationRepository: ConversationRepository,
  ) {}

  async createMessage(user: IUserCreated, data: CreateMessageData) {
    const conversation = await this.conversationRepository.findById(
      data.message_type,
      data.conversationId,
    );
    if (!conversation)
      throw new HttpException(
        'Conversation not found!',
        HttpStatus.BAD_REQUEST,
      );

    const payload = this.getPayload(user, data) as unknown as Constructor;
    return await this.messageFactory.createNewMessage(payload.message_type, {
      ...payload,
      message_received: conversation.participants,
    });
  }

  async delete(
    user: IUserCreated,
    messageId: string,
    data: DelelteMessageData,
  ) {
    const payload = this.getPayload(user, data) as unknown as Constructor;
    return await this.messageFactory.deleteMessage(
      payload.message_type,
      messageId,
      payload,
    );
  }

  async update(user: IUserCreated, messageId: string, data: UpdateMessageData) {
    const payload = this.getPayload(user, data) as unknown as Constructor;
    const dataReceived = await this.messageFactory.updateMessage(
      payload.message_type,
      messageId,
      payload,
    );
    console.log(dataReceived);
    return dataReceived;
  }

  getPayload(user: IUserCreated, data: any) {
    const userSenderMessage = {
      userId: user._id,
      email: user.email,
      avatarUrl: user.avatarUrl,
      userName: `${user.firstName} ${user.lastName}`,
    };

    const payload = {
      ...data,
      message_sender_by: userSenderMessage,
      messageRepository: this.messageRepository,
      conversationRepository: this.conversationRepository,
    };

    return payload;
  }
}
