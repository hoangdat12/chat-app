import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import {
  PayloadCreateMessage,
  Received,
  UserSenderMessage,
} from './message.dto';
import { Conversation } from '../schema/model/conversation.model';
import { Group } from '../schema/model/group.model';
import { MessageRepository } from './message.repository';
import { ConversationDTO } from 'src/schema/dto/ConversationDTO';
import { GroupDTO } from 'src/schema/dto/GroupDTO';
import { Ok } from 'src/ultils/response';

export interface CreateMessage extends PayloadCreateMessage {
  message_sender_by: UserSenderMessage;
  messageRepository: MessageRepository;
}

@Injectable()
export class MessageFactory {
  static typeMessage = {};

  static registerTypeMessage(type: string, classRef: any) {
    this.typeMessage[type] = classRef;
  }

  async createNewMessage(type: string, payload: CreateMessage) {
    if (!MessageFactory.typeMessage[type])
      throw new HttpException('Type not found!', HttpStatus.BAD_REQUEST);
    else return new MessageFactory.typeMessage[type](payload).create();
  }
}

export abstract class BaseMessage {
  message_type: string;
  message_content: string;
  message_sender_by: UserSenderMessage;

  constructor(
    message_type: string,
    message_content: string,
    message_sender_by: UserSenderMessage,
  ) {
    this.message_type = message_type;
    this.message_content = message_content;
    this.message_sender_by = message_sender_by;
  }

  abstract create(): void;
}

export class ConversationMessage extends BaseMessage {
  private readonly messageRepository: MessageRepository;
  message_type_model: ConversationDTO;
  message_received: Received;

  constructor(payload: CreateMessage) {
    super(
      payload.message_type,
      payload.message_content,
      payload.message_sender_by,
    );
    this.message_type_model = payload.message_type_model as ConversationDTO;
    this.message_received = payload.message_received as Received;
    this.messageRepository = payload.messageRepository;
  }

  async create() {
    const { messageRepository, ...payload } = this;
    const message = await this.messageRepository.createMessageConversation(
      payload,
    );
    if (!message) {
      throw new HttpException(
        'Create message Error!',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    return new Ok<any>(message, 'Success!');
  }
}

export class GroupMessage extends BaseMessage {
  private readonly messageRepository: MessageRepository;
  message_type_model: GroupDTO;
  message_received: Received[];

  constructor(payload: CreateMessage) {
    super(
      payload.message_type,
      payload.message_content,
      payload.message_sender_by,
    );
    this.message_type_model = payload.message_type_model as GroupDTO;
    this.message_received = payload.message_received as Received[];
    this.messageRepository = payload.messageRepository;
  }

  async create() {
    const { messageRepository, ...payload } = this;
    const message = await this.messageRepository.createMessageGroup(payload);
    if (!message) {
      throw new HttpException(
        'Create message Error!',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    return new Ok<any>(message, 'Success!');
  }
}

MessageFactory.registerTypeMessage('conversation', ConversationMessage);
MessageFactory.registerTypeMessage('group', GroupMessage);
