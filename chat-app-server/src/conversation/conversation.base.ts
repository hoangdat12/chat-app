import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UserSenderMessage } from '../message/message.dto';
import { ConversationRepository } from './conversation.repository';

export interface IPayloadCreateConversation {
  conversation_type: string;
  participants: UserSenderMessage[];
  lastMessage: string | null;
  lastMessageSendAt: Date | null;
  creator: UserSenderMessage | null;
  name: string | null;
}

export interface CreateConversation extends IPayloadCreateConversation {
  conversationRepository: ConversationRepository;
}

@Injectable()
export class ConversationFactory {
  static typeConversation = {};

  static registerTypeConversation(type: string, classRef: any) {
    ConversationFactory.typeConversation[type] = classRef;
  }

  async createConversation(type: string, payload: CreateConversation) {
    const classRef = ConversationFactory.typeConversation[type];
    if (!classRef)
      throw new HttpException('Type not found!', HttpStatus.NOT_FOUND);
    else return new classRef(payload).create();
  }
}

export abstract class BaseConversation {
  conversation_type: string;
  participants: UserSenderMessage[];
  lastMessage: string;
  lastMessageSendAt: Date;

  constructor(
    conversation_type: string,
    participants: UserSenderMessage[],
    lastMessage: string,
    lastMessageSendAt: Date,
  ) {
    this.conversation_type = conversation_type;
    this.participants = participants;
    this.lastMessage = lastMessage;
    this.lastMessageSendAt = lastMessageSendAt;
  }

  abstract create(): Promise<any>;
}

export class Conversation extends BaseConversation {
  private readonly conversationRepository: ConversationRepository;

  constructor(payload: CreateConversation) {
    super(
      payload.conversation_type,
      payload.participants,
      payload.lastMessage,
      payload.lastMessageSendAt,
    );
    this.conversationRepository = payload.conversationRepository;
  }

  async create(): Promise<any> {
    const { conversationRepository, ...payload } = this;
    return await this.conversationRepository.createConversation(payload);
  }
}

export class Group extends BaseConversation {
  private readonly conversationRepository: ConversationRepository;
  creator: UserSenderMessage;
  name: string;

  constructor(payload: CreateConversation) {
    super(
      payload.conversation_type,
      payload.participants,
      payload.lastMessage,
      payload.lastMessageSendAt,
    );
    this.creator = payload.creator;
    this.name = payload.name;
    this.conversationRepository = payload.conversationRepository;
  }

  async create(): Promise<any> {
    const { conversationRepository, ...payload } = this;
    return await this.conversationRepository.createGroup(payload);
  }
}

ConversationFactory.registerTypeConversation('conversation', Conversation);
ConversationFactory.registerTypeConversation('group', Group);
