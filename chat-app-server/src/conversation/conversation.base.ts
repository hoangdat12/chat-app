import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Received, UserSenderMessage } from '../message/message.dto';
import { ConversationRepository } from './conversation.repository';
import { PayloadCreateConversation } from './conversation.dto';
import {
  IMessagePagination,
  MessageRepository,
} from '../message/message.repository';
import { Ok } from '../ultils/response';
import { IUserCreated } from '../auth/repository/auth.repository';

export interface IConstructorConversation extends PayloadCreateConversation {
  conversationId: string | null;
  conversationRepository: ConversationRepository;
  messageRepository: MessageRepository;
}

@Injectable()
export class ConversationFactory {
  static typeConversation = {};

  static registerTypeConversation(type: string, classRef: any) {
    ConversationFactory.typeConversation[type] = classRef;
  }

  async createConversation(type: string, payload: IConstructorConversation) {
    const classRef = ConversationFactory.typeConversation[type];
    if (!classRef)
      throw new HttpException('Type not found!', HttpStatus.NOT_FOUND);
    else return new classRef(payload).create();
  }

  async getMessageOfConversation(
    type: string,
    payload: IConstructorConversation,
    pagination: IMessagePagination,
  ) {
    const classRef = ConversationFactory.typeConversation[type];
    if (!classRef)
      throw new HttpException('Type not found!', HttpStatus.NOT_FOUND);
    else return new classRef(payload).getMessageOfConversation(pagination);
  }

  async deletePaticipantOfConversation(
    user: IUserCreated,
    paticipantId: string,
    payload: IConstructorConversation,
  ) {
    return new Group(payload).deleteParticipant(user, paticipantId);
  }
}

export abstract class BaseConversation {
  conversation_type: string;
  participants: UserSenderMessage[] | null;
  lastMessage: string | null;
  lastMessageSendAt: Date | null;
  conversationId: string;
  protected readonly conversationRepository: ConversationRepository;
  protected readonly messageRepository: MessageRepository;

  constructor(
    conversation_type: string,
    participants: UserSenderMessage[],
    lastMessage: string,
    lastMessageSendAt: Date,
    conversationRepository: ConversationRepository,
    messageRepository: MessageRepository,
    conversationId: string,
  ) {
    this.conversation_type = conversation_type;
    this.participants = participants || null;
    this.lastMessage = lastMessage || null;
    this.lastMessageSendAt = lastMessageSendAt || null;
    this.conversationRepository = conversationRepository;
    this.messageRepository = messageRepository;
    this.conversationId = conversationId;
  }

  abstract create(): Promise<any>;

  async getMessageOfConversation(pagination: IMessagePagination) {
    const conversationExist = await this.conversationRepository.findById(
      this.conversation_type,
      this.conversationId,
    );
    if (!conversationExist)
      throw new HttpException(
        'Conversation not found!',
        HttpStatus.BAD_REQUEST,
      );

    let userValidInConversation = false;
    for (let participant of conversationExist.participants) {
      // const condition =
      //   participant.userId.toString() ===
      //     this.participants[0].userId.toString() &&
      //   participant.email === this.participants[0].email;
      // if (condition) {
      //   userValidInConversation = true;
      // }
      if (participant.email === this.participants[0].email) {
        userValidInConversation = true;
      }
    }
    if (!userValidInConversation)
      throw new HttpException(
        'You not permission get message!',
        HttpStatus.BAD_REQUEST,
      );
    console;
    const messages = await this.messageRepository.findMessageOfConversation(
      this.conversation_type,
      this.conversationId,
      pagination,
    );
    if (!messages)
      throw new HttpException('DB error!', HttpStatus.INTERNAL_SERVER_ERROR);
    else {
      const metaData = {
        messages,
        ...pagination,
      };
      return new Ok<any>(metaData, 'Get message success!');
    }
  }

  // async deleteConversation() {
  //   const conversation = this.conversationRepository.findById(
  //     this.conversation_type,
  //     this.conversationId,
  //   );
  //   if (!conversation)
  //     throw new HttpException(
  //       'Conversation not found!',
  //       HttpStatus.BAD_REQUEST,
  //     );
  //   // if (conversation)
  // }
}

export class Conversation extends BaseConversation {
  constructor(payload: IConstructorConversation) {
    super(
      payload.conversation_type,
      payload.participants,
      payload.lastMessage,
      payload.lastMessageSendAt,
      payload.conversationRepository,
      payload.messageRepository,
      payload.conversationId,
    );
  }

  async create(): Promise<any> {
    const { conversationRepository, ...payload } = this;
    return await this.conversationRepository.createConversation(payload);
  }

  async getMessageOfConversation(pagination: IMessagePagination) {
    return await super.getMessageOfConversation(pagination);
  }
}

export class Group extends BaseConversation {
  creators: UserSenderMessage[] | null;
  name: string | null;

  constructor(payload: IConstructorConversation) {
    super(
      payload.conversation_type,
      payload.participants,
      payload.lastMessage,
      payload.lastMessageSendAt,
      payload.conversationRepository,
      payload.messageRepository,
      payload.conversationId,
    );
    this.creators = payload.creators || null;
    this.name = payload.name || null;
  }

  async create(): Promise<any> {
    const { conversationRepository, ...payload } = this;
    return await this.conversationRepository.createGroup(payload);
  }

  async getMessageOfConversation(pagination: IMessagePagination) {
    return await super.getMessageOfConversation(pagination);
  }

  async deleteParticipant(user: IUserCreated, participantId: string) {
    const conversation = await this.conversationRepository.findGroupById(
      this.conversationId,
    );
    if (!conversation)
      throw new HttpException(
        'Conversation not found!',
        HttpStatus.BAD_REQUEST,
      );

    let isValid = false;
    for (let creator of conversation.creators) {
      if (creator.userId.toString() === user._id.toString()) {
        isValid = true;
      }
      if (creator.userId.toString() === participantId.toString()) {
        throw new HttpException(
          'User not permission delete administrators out of group!',
          HttpStatus.FORBIDDEN,
        );
      }
    }
    if (!isValid)
      throw new HttpException(
        'User not permission delete member out of group!',
        HttpStatus.FORBIDDEN,
      );

    const updateParticipantGroup =
      await this.conversationRepository.deletePaticipantOfGroup(
        this.conversationId,
        participantId,
      );
    if (!updateParticipantGroup)
      throw new HttpException('DB error!', HttpStatus.INTERNAL_SERVER_ERROR);
    else {
      return new Ok<string>('Delete member success!', 'success');
    }
  }
}

ConversationFactory.registerTypeConversation('conversation', Conversation);
ConversationFactory.registerTypeConversation('group', Group);
