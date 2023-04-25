import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConversationFactory } from './conversation.base';
import {
  AuthRepository,
  IUserCreated,
} from '../auth/repository/auth.repository';
import { ConversationRepository } from './conversation.repository';
import { Ok } from '../ultils/response';
import {
  GetDeleteMessageOfConversation,
  PayloadAddPaticipant,
  PayloadCreateConversation,
  PayloadDeletePaticipant,
} from './conversation.dto';
import {
  IMessagePagination,
  MessageRepository,
} from '../message/message.repository';

@Injectable()
export class ConversationService {
  constructor(
    private readonly conversationFactory: ConversationFactory,
    private readonly conversationRepository: ConversationRepository,
    private readonly messageRepository: MessageRepository,
  ) {}

  async createConversation(
    user: IUserCreated,
    payload: PayloadCreateConversation,
  ) {
    const creator = {
      userId: user._id,
      email: user.email,
      avatarUrl: user.avatarUrl,
      userName: `${user.firstName} ${user.lastName}`,
    };
    const conversationRepository = this.conversationRepository;
    const messageRepository = this.messageRepository;
    const newConversation = await this.conversationFactory.createConversation(
      payload.conversation_type,
      {
        ...payload,
        creators: [creator],
        conversationRepository,
        messageRepository,
        conversationId: null,
      },
    );

    if (!newConversation)
      throw new HttpException(
        'Server Error!',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    else return new Ok<any>(newConversation, 'success!');
  }

  async getMessageOfConversation(
    user: IUserCreated,
    data: GetDeleteMessageOfConversation,
    pagination: IMessagePagination,
  ) {
    const dataUpdate = {
      ...data,
    };

    const payload = this.getPayloadForConstructorConversation(dataUpdate);

    return await this.conversationFactory.getMessageOfConversation(
      data.conversationType,
      user,
      payload,
      pagination,
    );
  }

  async deleteConversation(
    user: IUserCreated,
    data: GetDeleteMessageOfConversation,
  ) {
    const payload = this.getPayloadForConstructorConversation(data);
    return await this.conversationFactory.deleteConversation(user, payload);
  }

  async deletePaticipantOfConversation(
    user: IUserCreated,
    data: PayloadDeletePaticipant,
  ) {
    const dataUpdate = {
      ...data,
      conversation_type: 'group',
    };
    const payload = this.getPayloadForConstructorConversation(dataUpdate);

    return await this.conversationFactory.deletePaticipantOfConversation(
      user,
      data.paticipantId,
      payload,
    );
  }

  async addPaticipantOfConversation(
    user: IUserCreated,
    data: PayloadAddPaticipant,
  ) {
    const dataUpdate = {
      ...data,
      conversation_type: 'group',
    };
    const payload = this.getPayloadForConstructorConversation(dataUpdate);

    return await this.conversationFactory.addPaticipantOfConversation(
      user,
      data.paticipant,
      payload,
    );
  }

  getPayloadForConstructorConversation(data: any) {
    return {
      conversationRepository: this.conversationRepository,
      messageRepository: this.messageRepository,
      conversationId: data?.conversationId || null,
      conversation_type: data.conversationType,
      participants: data?.participants || null,
      lastMessage: data?.lastMessage || null,
      lastMessageSendAt: data?.lastMessageSendAt || null,
      creators: data?.creators || null,
      name: data?.name || null,
    };
  }
}
