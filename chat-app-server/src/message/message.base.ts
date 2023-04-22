import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import {
  PayloadCreateMessage,
  Received,
  UserSenderMessage,
} from './message.dto';
import { Conversation } from '../schema/model/conversation.model';
import { Group } from '../schema/model/group.model';
import { MessageRepository } from './message.repository';

@Injectable()
export class MessageFactory {
  static typeMessage = {};

  static registerTypeMessage(type: string, classRef: any) {
    this.typeMessage[type] = classRef;
  }

  async createNewMessage(type: string, payload: PayloadCreateMessage) {
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

  abstract createProduct(): void;
}

export class ConversationMessage extends BaseMessage {
  message_type_model: Conversation;
  message_received: Received;

  constructor(
    private readonly messageRepository: MessageRepository,
    message_type: string,
    message_content: string,
    message_sender_by: UserSenderMessage,
    message_type_model: Conversation,
    message_received: Received,
  ) {
    super(message_type, message_content, message_sender_by);
    this.message_type_model = message_type_model;
    this.message_received = message_received;
  }

  async createProduct() {
    const message = await this.messageRepository.createMessageConversation(
      this,
    );
    if (!message) {
      throw new HttpException(
        'Create message Error!',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}

export class GroupMessage extends BaseMessage {
  message_type_model: Group;
  message_received: Received[];

  constructor(
    private readonly messageRepository: MessageRepository,
    message_type: string,
    message_content: string,
    message_sender_by: UserSenderMessage,
    message_type_model: Group,
    message_received: Received[],
  ) {
    super(message_type, message_content, message_sender_by);
    this.message_type_model = message_type_model;
    this.message_received = message_received;
  }

  async createProduct() {
    const message = await this.messageRepository.createMessageGroup(this);
    if (!message) {
      throw new HttpException(
        'Create message Error!',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}

MessageFactory.registerTypeMessage('conversation', ConversationMessage);
MessageFactory.registerTypeMessage('group', GroupMessage);
