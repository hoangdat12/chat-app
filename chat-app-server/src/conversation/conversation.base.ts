import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UserSenderMessage } from '../message/message.dto';
import { ConversationRepository } from './conversation.repository';

export interface IPayloadCreateConversation {
  participants: UserSenderMessage[];
  lastMessage: string | null;
  lastMessageSendAt: Date | null;
  creator: UserSenderMessage | null;
  name: string | null;
}

@Injectable()
export class ConversationFactory {
  static typeConversation = {};

  static registerTypeConversation(type: string, classRef: any) {
    ConversationFactory.typeConversation[type] = classRef;
  }

  async createConversation(type: string, payload: IPayloadCreateConversation) {
    const classRef = ConversationFactory.typeConversation[type];
    if (!classRef)
      throw new HttpException('Type not found!', HttpStatus.NOT_FOUND);
    else return await classRef(payload).create();
  }
}

export abstract class BaseConversation {
  participants: UserSenderMessage[];
  lastMessage: string;
  lastMessageSendAt: Date;

  constructor(
    participants: UserSenderMessage[],
    lastMessage: string,
    lastMessageSendAt: Date,
  ) {
    this.participants = participants;
    this.lastMessage = lastMessage;
    this.lastMessageSendAt = lastMessageSendAt;
  }

  abstract create(): Promise<any>;
}

export class Conversation extends BaseConversation {
  constructor(
    private readonly conversationRepository: ConversationRepository,
    participants: UserSenderMessage[],
    lastMessage: string,
    lastMessageSendAt: Date,
  ) {
    super(participants, lastMessage, lastMessageSendAt);
  }

  async create(): Promise<any> {
    return await this.conversationRepository.createConversation(this);
  }
}

export class Group extends BaseConversation {
  creator: UserSenderMessage;
  name: string;

  constructor(
    private readonly conversationRepository: ConversationRepository,
    participants: UserSenderMessage[],
    lastMessage: string,
    lastMessageSendAt: Date,
    creator: UserSenderMessage,
    name: string,
  ) {
    super(participants, lastMessage, lastMessageSendAt);
    this.creator = creator;
    this.name = name;
  }

  async create(): Promise<any> {
    return await this.conversationRepository.createGroup(this);
  }
}

ConversationFactory.registerTypeConversation('conversation', Conversation);
ConversationFactory.registerTypeConversation('group', Group);
