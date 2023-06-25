import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UserJoinChat } from './message.dto';
import { MessageRepository } from './message.repository';
import { Ok } from '../ultils/response';
import { ConversationRepository } from '../conversation/conversation.repository';
import { Group } from 'src/schema/model/group.model';
import { Conversation } from 'src/schema/model/conversation.model';
import { Constructor, IParticipant } from '../ultils/interface';

@Injectable()
export class MessageFactory {
  static typeMessage = {};

  static registerTypeMessage(type: string, classRef: any) {
    this.typeMessage[type] = classRef;
  }

  async createNewMessage(type: string, payload: Constructor) {
    if (!MessageFactory.typeMessage[type])
      throw new HttpException('Type not found!', HttpStatus.BAD_REQUEST);
    else return new MessageFactory.typeMessage[type](payload).create();
  }

  async deleteMessage(type: string, messageId: string, payload: Constructor) {
    if (!MessageFactory.typeMessage[type])
      throw new HttpException('Type not found!', HttpStatus.BAD_REQUEST);
    else return new MessageFactory.typeMessage[type](payload).delete(messageId);
  }

  async updateMessage(type: string, messageId: string, payload: Constructor) {
    if (!MessageFactory.typeMessage[type])
      throw new HttpException('Type not found!', HttpStatus.BAD_REQUEST);
    else return new MessageFactory.typeMessage[type](payload).update(messageId);
  }
}

export abstract class BaseMessage {
  message_type: string;
  message_content: string;
  message_sender_by: UserJoinChat;
  protected readonly messageRepository: MessageRepository;
  protected readonly conversationRepository: ConversationRepository;

  constructor(
    message_type: string,
    message_content: string,
    message_sender_by: UserJoinChat,
    messageRepository: MessageRepository,
    conversationRepository: ConversationRepository,
  ) {
    this.message_type = message_type || null;
    this.message_content = message_content || null;
    this.message_sender_by = message_sender_by;
    this.messageRepository = messageRepository;
    this.conversationRepository = conversationRepository;
  }

  abstract create(): Promise<any>;

  async update(messageId: string, conversationId: string, userId: string) {
    await this.checkConversationExist(
      this.message_type,
      conversationId,
      userId,
    );
    await this.checkOwnerMessage(messageId, conversationId);

    const data = {
      messageType: this.message_type,
      messageId,
      messageContent: this.message_content,
      conversationId,
    };
    const messageUpdate = await this.messageRepository.updateMessage(data);

    if (!messageUpdate)
      throw new HttpException('DB error!', HttpStatus.BAD_REQUEST);
    else return new Ok<any>(messageUpdate, 'success');
  }

  // Go tin nhan
  async delete(
    messageId: string,
    conversationId: string,
    userId: string,
  ): Promise<any> {
    await this.checkConversationExist(
      this.message_type,
      conversationId,
      userId,
    );
    await this.checkOwnerMessage(messageId, conversationId);

    const data = {
      messageType: this.message_type,
      messageId,
      conversationId,
    };

    return new Ok(await this.messageRepository.delete(data), 'success');
  }

  async checkConversationExist(
    type: string,
    conversationId: string,
    userId: string,
  ) {
    const conversation = await this.conversationRepository.findUserExist(
      type,
      conversationId,
      userId,
    );
    if (!conversation)
      throw new HttpException(
        'Conversation not found!',
        HttpStatus.BAD_REQUEST,
      );
    return conversation;
  }

  async userPermissionSendMessage(
    participants: IParticipant[],
    userId: string,
  ) {
    let exist = false;
    for (let participant of participants) {
      if (
        participant.userId === userId.toString() &&
        participant.enable === true
      ) {
        exist = true;
      }
    }
    if (!exist)
      throw new HttpException(
        'User not exist in conversation',
        HttpStatus.BAD_REQUEST,
      );
  }

  async checkUserExistConversation(
    participants: IParticipant[],
    userId: string,
  ) {
    let exist = false;
    for (let participant of participants) {
      if (participant.userId === userId) {
        exist = true;
      }
    }
    if (!exist)
      throw new HttpException(
        'User not exist in conversation',
        HttpStatus.BAD_REQUEST,
      );
  }

  async checkOwnerMessage(messageId: string, conversationId: string) {
    await this.getMessageTypeModel(conversationId);
    const message = await this.messageRepository.findById(messageId);

    if (!message)
      throw new HttpException('Message not found', HttpStatus.BAD_REQUEST);

    if (
      message.message_sender_by.userId.toString() !==
      this.message_sender_by.userId.toString()
    )
      throw new HttpException('You not permission', HttpStatus.BAD_REQUEST);
  }

  async getMessageTypeModel(conversationId: string) {
    const message_type_model = await this.conversationRepository.findById(
      this.message_type,
      conversationId,
    );

    if (!message_type_model)
      throw new HttpException(
        'Conversation not found!',
        HttpStatus.BAD_REQUEST,
      );
    return message_type_model;
  }
}

export class ConversationMessage extends BaseMessage {
  message_received: UserJoinChat;
  conversationId: string;

  constructor(payload: Constructor) {
    super(
      payload.message_type,
      payload.message_content,
      payload.message_sender_by,
      payload.messageRepository,
      payload.conversationRepository,
    );
    this.message_received = (payload.message_received as UserJoinChat) || null;
    this.conversationId = payload.conversationId;
  }

  async create() {
    const { messageRepository, ...payload } = this;
    await super.checkConversationExist(
      this.message_type,
      this.conversationId,
      this.message_sender_by.userId,
    );
    const message = await this.messageRepository.createMessageConversation({
      ...payload,
      message_type_model: (await super.getMessageTypeModel(
        this.conversationId,
      )) as unknown as Conversation,
    });

    if (!message) {
      throw new HttpException(
        'Create message Error!',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    const conversation =
      await this.conversationRepository.updateLastConversationMessage(
        this.conversationId,
        message.message_content,
      );
    if (!conversation)
      throw new HttpException('DB errors', HttpStatus.INTERNAL_SERVER_ERROR);

    return message;
  }

  async update(messageId: string): Promise<any> {
    return await super.update(
      messageId,
      this.conversationId,
      this.message_sender_by.userId,
    );
  }

  async delete(messageId: string) {
    return await super.delete(
      messageId,
      this.conversationId,
      this.message_sender_by.userId,
    );
  }
}

export class GroupMessage extends BaseMessage {
  conversationId: string;
  message_received: UserJoinChat[];

  constructor(payload: Constructor) {
    super(
      payload.message_type,
      payload.message_content,
      payload.message_sender_by,
      payload.messageRepository,
      payload.conversationRepository,
    );
    this.message_received =
      (payload.message_received as UserJoinChat[]) || null;
    this.conversationId = payload.conversationId;
  }

  async create() {
    const { messageRepository, ...payload } = this;
    await super.checkConversationExist(
      this.message_type,
      this.conversationId,
      this.message_sender_by.userId,
    );

    const message = await this.messageRepository.createMessageConversation({
      message_type_model: this.conversationId,
      ...payload,
    });

    if (!message) {
      throw new HttpException(
        'Create message Error!',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    const group = await this.conversationRepository.updateLastGroupMessage(
      this.conversationId,
      message.message_content,
    );

    if (!group)
      throw new HttpException('DB errors', HttpStatus.INTERNAL_SERVER_ERROR);

    return message;
  }

  async update(messageId: string): Promise<any> {
    return await super.update(
      messageId,
      this.conversationId,
      this.message_sender_by.userId,
    );
  }

  async delete(messageId: string) {
    return await super.delete(
      messageId,
      this.conversationId,
      this.message_sender_by.userId,
    );
  }
}

MessageFactory.registerTypeMessage('conversation', ConversationMessage);
MessageFactory.registerTypeMessage('group', GroupMessage);
