import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UserJoinChat } from '../message/message.dto';
import { ConversationRepository } from './conversation.repository';
import {
  IInforUserChangeNickname,
  PayloadCreateConversation,
} from './conversation.dto';
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
    const classRef = this.getClassRef(type);
    return new classRef(payload).create();
  }

  async getMessageOfConversation(
    type: string,
    user: IUserCreated,
    payload: IConstructorConversation,
    pagination: IMessagePagination,
  ) {
    const classRef = this.getClassRef(type);
    return new classRef(payload).getMessageOfConversation(user, pagination);
  }

  async deleteConversation(
    user: IUserCreated,
    payload: IConstructorConversation,
  ) {
    const classRef = this.getClassRef(payload.conversation_type);
    return new classRef(payload).deleteConversation(user);
  }

  async deletePaticipantOfConversation(
    user: IUserCreated,
    paticipantId: string,
    payload: IConstructorConversation,
  ) {
    return new Group(payload).deleteParticipant(user, paticipantId);
  }

  async addPaticipantOfConversation(
    user: IUserCreated,
    participant: UserJoinChat,
    payload: IConstructorConversation,
  ) {
    return new Group(payload).addParticipant(user, participant);
  }

  async setNickNameForParticipant(
    user: IUserCreated,
    users: IInforUserChangeNickname[],
    payload: IConstructorConversation,
  ) {
    const classRef = this.getClassRef(payload.conversation_type);
    return new classRef(payload).setNickNameForParticipant(user, users);
  }

  async changeTopicConversation(
    user: IUserCreated,
    topic: string,
    payload: IConstructorConversation,
  ) {
    const classRef = this.getClassRef(payload.conversation_type);
    return new classRef(payload).changeTopicConversation(user, topic);
  }

  async renameGroup(user: IUserCreated, payload: IConstructorConversation) {
    return new Group(payload).renameGroup(user);
  }

  getClassRef(type: string) {
    const classRef = ConversationFactory.typeConversation[type];
    if (!classRef)
      throw new HttpException('Type not found!', HttpStatus.NOT_FOUND);
    else return classRef;
  }
}

export abstract class BaseConversation {
  conversation_type: string;
  participants: UserJoinChat[] | null;
  lastMessage: string | null;
  lastMessageSendAt: Date | null;
  conversationId: string;
  protected readonly conversationRepository: ConversationRepository;
  protected readonly messageRepository: MessageRepository;

  constructor(
    conversation_type: string,
    participants: UserJoinChat[],
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

  async getMessageOfConversation(
    user: IUserCreated,
    pagination: IMessagePagination,
  ) {
    const conversation = await this.checkConversationExist(
      this.conversation_type,
    );
    await this.checkUserIsPermission(user._id, conversation.participants);

    const messages = await this.messageRepository.findMessageOfConversation(
      this.conversation_type,
      user._id,
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

  async deleteConversation(user: IUserCreated) {
    const conversation = await this.checkConversationExist(
      this.conversation_type,
    );

    await this.checkUserIsPermission(user._id, conversation.participants);

    const conversationUpdate = this.messageRepository.deleteConversation(
      this.conversation_type,
      user._id,
      this.conversationId,
      user._id,
    );
    if (!conversationUpdate)
      throw new HttpException('DB erorr!', HttpStatus.INTERNAL_SERVER_ERROR);
    else {
      return new Ok<string>('Delete conversation success!', 'success');
    }
  }

  async setNickNameForParticipant(
    user: IUserCreated,
    payloads: IInforUserChangeNickname[],
  ) {
    // const conversation = await this.checkConversationExist(
    //   this.conversation_type,
    // );

    const conversation =
      await this.conversationRepository.findByIdWithMethodSave(
        this.conversation_type,
        this.conversationId,
      );
    if (!conversation)
      throw new HttpException(
        'Conversation not found!',
        HttpStatus.BAD_REQUEST,
      );

    // await this.checkUserIsPermission(user._id, conversation.participants);
    for (let participant of conversation.participants) {
      for (let payload of payloads) {
        if (payload.userId === participant.userId) {
          participant.userName = payload.userName;
          break;
        }
      }
    }

    conversation.save();
    return new Ok<any>(conversation, 'success!');
  }

  async changeTopicConversation(user: IUserCreated, topic: string) {
    const conversation = await this.checkConversationExist(
      this.conversation_type,
    );
    await this.checkUserIsPermission(user._id, conversation.participants);

    const changeTopic =
      await this.conversationRepository.changeTopicConversation(
        this.conversation_type,
        this.conversationId,
        topic,
      );
    if (!changeTopic)
      throw new HttpException('DB error!', HttpStatus.INTERNAL_SERVER_ERROR);
    else {
      return new Ok<any>(changeTopic, 'success');
    }
  }

  async checkConversationExist(type: string) {
    const conversation = await this.conversationRepository.findById(
      type,
      this.conversationId,
    );
    if (!conversation)
      throw new HttpException(
        'Conversation not found!',
        HttpStatus.BAD_REQUEST,
      );
    return conversation;
  }

  async checkUserIsPermission(userId: string, datas: UserJoinChat[]) {
    let isValid = false;
    for (let data of datas) {
      if (data.userId.toString() === userId.toString()) {
        isValid = true;
        break;
      }
    }
    if (!isValid)
      throw new HttpException(
        'User not permission delete member out of group!',
        HttpStatus.FORBIDDEN,
      );
  }
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

  async getMessageOfConversation(
    user: IUserCreated,
    pagination: IMessagePagination,
  ) {
    return await super.getMessageOfConversation(user, pagination);
  }
}

export class Group extends BaseConversation {
  creators: UserJoinChat[] | null;
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

  async getMessageOfConversation(
    user: IUserCreated,
    pagination: IMessagePagination,
  ) {
    return await super.getMessageOfConversation(user, pagination);
  }

  async deleteParticipant(user: IUserCreated, participantId: string) {
    const conversation = (await super.checkConversationExist(
      'group',
    )) as unknown as Group;

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

  async addParticipant(user: IUserCreated, participant: UserJoinChat) {
    const conversation = (await super.checkConversationExist(
      'group',
    )) as unknown as Group;

    await super.checkUserIsPermission(user._id, conversation.creators);

    let userExistConversation = null;
    for (let participant of conversation.participants) {
      if (participant.userId === user._id) {
        userExistConversation = participant;
      }
    }
    let updateParticipantGroup = null;

    if (userExistConversation) {
      if (userExistConversation.enable)
        throw new HttpException(
          'User is already exist in conversation!',
          HttpStatus.CONFLICT,
        );
      else {
        updateParticipantGroup =
          await this.conversationRepository.addPaticipantOfExistInConversation(
            this.conversationId,
            participant.userId,
          );
      }
    } else {
      updateParticipantGroup =
        await this.conversationRepository.addPaticipantOfConversation(
          this.conversationId,
          participant,
        );
    }

    if (!updateParticipantGroup)
      throw new HttpException('DB error!', HttpStatus.INTERNAL_SERVER_ERROR);
    else {
      return new Ok<string>('Add member success!', 'success');
    }
  }

  async renameGroup(user: IUserCreated) {
    const conversation = (await super.checkConversationExist(
      'group',
    )) as unknown as Group;

    await super.checkUserIsPermission(user._id, conversation.participants);

    const updateNameGroup = await this.conversationRepository.renameGroup(
      this.conversationId,
      this.name,
    );
    if (!updateNameGroup)
      throw new HttpException('DB error!', HttpStatus.INTERNAL_SERVER_ERROR);
    else {
      return new Ok<any>(updateNameGroup, 'success');
    }
  }
}

ConversationFactory.registerTypeConversation('conversation', Conversation);
ConversationFactory.registerTypeConversation('group', Group);
