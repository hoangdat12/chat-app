import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConversationFactory } from './conversation.base';
import { AuthRepository } from '../auth/repository/auth.repository';
import { ConversationRepository } from './conversation.repository';
import { Ok } from '../ultils/response';
import {
  ChangeNickNameOfParticipant,
  ChangeTopic,
  GetDeleteMessageOfConversation,
  PayloadAddPaticipant,
  PayloadCreateConversation,
  PayloadDeletePaticipant,
  RenameGroup,
} from './conversation.dto';
import { MessageRepository } from '../message/message.repository';
import { DelelteMessageData } from 'src/message/message.dto';
import { IUserCreated, Pagination } from '../ultils/interface';

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
    pagination: Pagination,
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

  async deleteConversationOfUser(user: IUserCreated, data: DelelteMessageData) {
    const payload = this.getPayloadForConstructorConversation(data);
    return await this.conversationFactory.deleteConversationOfUser(
      payload.conversation_type,
      user,
      payload,
    );
  }

  async setNickNameForParticipant(
    user: IUserCreated,
    data: ChangeNickNameOfParticipant,
  ) {
    const { newNicknameOfUser, ...pload } = data;
    const payload = this.getPayloadForConstructorConversation(pload);
    return await this.conversationFactory.setNickNameForParticipant(
      user,
      newNicknameOfUser,
      payload,
    );
  }

  async changeTopicOfConversation(user: IUserCreated, data: ChangeTopic) {
    const { topic, ...dataUpdate } = data;
    const payload = this.getPayloadForConstructorConversation(dataUpdate);
    return await this.conversationFactory.changeTopicConversation(
      user,
      topic,
      payload,
    );
  }

  async renameGroup(user: IUserCreated, data: RenameGroup) {
    const payload = this.getPayloadForConstructorConversation(data);
    return await this.conversationFactory.renameGroup(user, payload);
  }

  getPayloadForConstructorConversation(data: any) {
    return {
      conversationRepository: this.conversationRepository,
      messageRepository: this.messageRepository,
      conversationId: data?.conversationId || null,
      conversation_type: data?.conversationType || data?.conversation_type,
      participants: data?.participants || null,
      lastMessage: data?.lastMessage || null,
      lastMessageSendAt: data?.lastMessageSendAt || null,
      creators: data?.creators || null,
      name: data?.name || data?.nameGroup || null,
    };
  }
}
