import { MessageRepository } from '../message/message.repository';
import { ConversationRepository } from './conversation.repository';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import {
  IConversation,
  IParticipant,
  IUserCreated,
  Pagination,
} from '../ultils/interface';
import {
  IDataChangeUsernameOfParticipant,
  ChangeTopic,
  GetDeleteMessageOfConversation,
  PayloadAddPaticipant,
  PayloadCreateConversation,
  PayloadDeletePaticipant,
  RenameGroup,
  ChangeEmoji,
} from './conversation.dto';
import { MessageType } from '../ultils/constant';
import {
  convertMessageWithIdToString,
  getMessageNotify,
  getUsername,
} from '../ultils';
import { MessageContentType } from 'src/ultils/constant/message.constant';

@Injectable()
export class ConversationService {
  constructor(
    private readonly conversationRepository: ConversationRepository,
    private readonly messageRepository: MessageRepository,
  ) {}

  async createConversation(
    user: IUserCreated,
    payload: PayloadCreateConversation,
  ) {
    // Creator group
    const { conversation_type, avatarUrl } = payload;
    if (conversation_type === MessageType.GROUP) {
      const creator = {
        userId: user._id,
        email: user.email,
        avatarUrl: user.avatarUrl,
        userName: getUsername(user),
        enable: true,
      };
      payload.creators = [creator];
      payload.avatarUrl =
        avatarUrl ?? 'http://localhost:8080/assets/avatar.group.jpg';
    }
    const newConversation =
      await this.conversationRepository.createConversation(payload);

    if (!newConversation)
      throw new HttpException(
        'Server Error!',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    else return newConversation;
  }

  async getMessageOfConversation(
    user: IUserCreated,
    data: GetDeleteMessageOfConversation,
    pagination: Pagination,
  ) {
    const { conversationId } = data;
    const foundConversation = await this.conversationRepository.findUserExist(
      conversationId,
      user._id,
    );
    if (!foundConversation)
      throw new HttpException('Conversation not found!', HttpStatus.NOT_FOUND);

    const messages = await this.messageRepository.findMessageOfConversation(
      user._id,
      conversationId,
      pagination,
    );

    return {
      messages,
      limit: pagination.limit,
      page: pagination.page,
      sortBy: pagination.sortBy,
    };
  }

  // Delete conversation but still join group or conversation
  async deleteConversation(
    user: IUserCreated,
    data: GetDeleteMessageOfConversation,
  ) {
    const { conversationId } = data;
    const foundConversation = await this.conversationRepository.findUserExist(
      conversationId,
      user._id,
    );
    if (!foundConversation)
      throw new HttpException('Conversation not found!', HttpStatus.NOT_FOUND);

    await this.messageRepository.deleteConversation(conversationId, user._id);

    return foundConversation;
  }

  // Kick user from conversation
  async deletePaticipantOfConversation(
    user: IUserCreated,
    data: PayloadDeletePaticipant,
  ) {
    const { participant, conversationId } = data;
    const foundConversation = await this.conversationRepository.findUserExist(
      conversationId,
      user._id,
    );
    if (!foundConversation)
      throw new HttpException('Conversation not found!', HttpStatus.NOT_FOUND);

    this.checkUserIsAdmin(user, foundConversation);

    const payload = {
      message_type: foundConversation.conversation_type,
      message_content: `${getUsername(user)} deleted ${
        participant.userName
      } out of group`,
      conversationId: conversationId,
      message_received: foundConversation.participants,
      message_content_type: MessageContentType.NOTIFY,
    };
    // Create new Message
    const message = await this.messageRepository.createMessageConversation(
      user,
      payload,
    );
    if (!message)
      throw new HttpException('Server Error', HttpStatus.INTERNAL_SERVER_ERROR);

    await foundConversation.save();

    await this.conversationRepository.deletePaticipantOfGroup(
      conversationId,
      participant,
    );

    return {
      participant,
      conversation: foundConversation,
    };
  }

  async promotedAminGroup(user: IUserCreated, data: PayloadDeletePaticipant) {
    const { participant, conversationId } = data;
    const foundConversation = await this.conversationRepository.findUserExist(
      conversationId,
      user._id,
    );
    if (!foundConversation)
      throw new HttpException('Conversation not found!', HttpStatus.NOT_FOUND);

    this.checkUserIsAdmin(user, foundConversation);

    const { isReadLastMessage, ...newCreator } = participant;
    foundConversation.creators = [...foundConversation.creators, newCreator];
    await foundConversation.save();

    return {
      participant,
      conversation: foundConversation,
    };
  }

  // Add new member
  async addPaticipantOfConversation(
    user: IUserCreated,
    data: PayloadAddPaticipant,
  ) {
    let { conversation_type, conversationId, newParticipants } = data;
    if (conversation_type !== MessageType.GROUP) {
      return;
    }

    const foundConversation = await this.conversationRepository.findUserExist(
      conversationId,
      user._id,
    );
    if (!foundConversation)
      throw new HttpException('Conversation not found!', HttpStatus.NOT_FOUND);

    // Check user is exist in participant or not
    let userWasDeletedId: string[] = [];
    let userWasDeleted: IParticipant[] = [];
    let newMember: IParticipant[] = [];

    for (let newer of newParticipants) {
      let userExist = false;
      for (let participant of foundConversation.participants) {
        // If user exist in conversation
        if (participant.userId === newer.userId) {
          userExist = true;
          // If user was deleted from group then enable user
          if (!participant.enable) {
            participant.enable = true;
            userWasDeletedId.push(newer.userId);
            userWasDeleted.push(newer);
            continue;
          } else {
            continue;
          }
        }
      }
      // If user not exist in conversation
      if (!userExist) {
        newer.enable = true;
        newer.isReadLastMessage = false;
        newMember.push(newer);
      }
    }

    // if (userWasDeleted.length > 0) {
    //   console.log('foundConversation::: ', foundConversation);
    //   await foundConversation.save();
    // }
    if (userWasDeletedId.length > 0) {
      await this.conversationRepository.addPaticipantOfExistInConversation(
        conversationId,
        userWasDeletedId,
      );
    } else if (newMember.length > 0) {
      await this.conversationRepository.addPaticipantOfConversation(
        conversationId,
        newMember,
      );
    } else
      return {
        conversationId,
        newMember: [],
        lastMessage: null,
      };

    // Notify
    const payload = {
      message_type: foundConversation.conversation_type,
      message_content: getMessageNotify(user, [
        ...newMember,
        ...userWasDeleted,
      ]),
      conversationId,
      message_received: [
        ...foundConversation.participants,
        ...newMember,
        ...userWasDeleted,
      ],
      message_content_type: MessageContentType.NOTIFY,
    };

    // Create new Message
    const message = await this.messageRepository.createMessageConversation(
      user,
      payload,
    );
    if (!message)
      throw new HttpException('Server Error', HttpStatus.INTERNAL_SERVER_ERROR);

    // Update lastMessage
    await this.conversationRepository.updateLastConversationMessage(
      user,
      conversationId,
      convertMessageWithIdToString(message),
    );

    return {
      conversationId,
      newMember: [...newMember, ...userWasDeleted],
      lastMessage: message,
    };
  }

  async changeUsernameOfUser(
    user: IUserCreated,
    data: IDataChangeUsernameOfParticipant,
  ) {
    const userExistInConversation =
      await this.conversationRepository.findUserExist(
        data.conversationId,
        user._id,
      );
    if (!userExistInConversation)
      throw new HttpException('User not permission!', HttpStatus.BAD_REQUEST);
    const updated = await this.conversationRepository.changeUsernameOfUser(
      user,
      data,
    );
    if (!updated)
      throw new HttpException(
        'Server Error!',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );

    return { ...data, participants: userExistInConversation.participants };
  }

  async changeTopicOfConversation(user: IUserCreated, data: ChangeTopic) {
    const { conversationId, topic } = data;
    const foundConversation = await this.conversationRepository.findUserExist(
      conversationId,
      user._id,
    );

    if (!foundConversation)
      throw new HttpException('Conversation not found!', HttpStatus.NOT_FOUND);

    return await this.conversationRepository.changeTopicConversation(
      conversationId,
      topic,
    );
  }

  async renameGroup(user: IUserCreated, data: RenameGroup) {
    const { conversationId, nameGroup } = data;
    const foundConversation = await this.conversationRepository.findUserExist(
      conversationId,
      user._id,
    );

    if (!foundConversation)
      throw new HttpException('Conversation not found!', HttpStatus.NOT_FOUND);

    const payload = {
      message_type: foundConversation.conversation_type,
      message_content: `${getUsername(user)} changed name of group`,
      conversationId: conversationId,
      message_received: foundConversation.participants,
      message_content_type: MessageContentType.NOTIFY,
    };
    // Create new Message
    const message = await this.messageRepository.createMessageConversation(
      user,
      payload,
    );
    if (!message)
      throw new HttpException('Server Error', HttpStatus.INTERNAL_SERVER_ERROR);

    foundConversation.nameGroup = nameGroup;
    foundConversation.lastMessage = convertMessageWithIdToString(message);
    const responseData = await foundConversation.save();

    return {
      user,
      conversation: responseData,
    };
  }

  async changeAvatarGroup(
    user: IUserCreated,
    conversationId: string,
    file: Express.Multer.File,
  ) {
    const foundConversation = await this.conversationRepository.findUserExist(
      conversationId,
      user._id,
    );
    if (!foundConversation)
      throw new HttpException('Conversation not found!', HttpStatus.NOT_FOUND);

    const payload = {
      message_type: foundConversation.conversation_type,
      message_content: `${getUsername(user)} changed avatar of group`,
      conversationId: conversationId,
      message_received: foundConversation.participants,
      message_content_type: MessageContentType.NOTIFY,
    };
    // Create new Message
    const message = await this.messageRepository.createMessageConversation(
      user,
      payload,
    );
    if (!message)
      throw new HttpException('Server Error', HttpStatus.INTERNAL_SERVER_ERROR);

    const avatarUrl = `http://localhost:8080/assets/${file.filename}`;
    foundConversation.avatarUrl = avatarUrl;
    foundConversation.lastMessage = convertMessageWithIdToString(message);
    return await foundConversation.save();
  }

  async readLastMessage(user: IUserCreated, conversationId: string) {
    const updateConversation =
      await this.conversationRepository.readLastMessage(user, conversationId);
    return updateConversation ? true : false;
  }

  // Find by name of group for Group and name of user for Conversation
  async findByName(
    user: IUserCreated,
    keyword: string,
    pagination: Pagination,
  ) {
    return await this.conversationRepository.findByName(
      user,
      keyword.trim(),
      pagination,
    );
  }

  async getFirstConversation(user: IUserCreated) {
    const data = await this.conversationRepository.getFirstConversation(user);
    return data[0];
  }

  async changeEmoji(user: IUserCreated, data: ChangeEmoji) {
    const foundConversation = await this.conversationRepository.findUserExist(
      data.conversationId,
      user._id,
    );

    if (!foundConversation)
      throw new HttpException('You not permission!', HttpStatus.BAD_REQUEST);

    const payload = {
      message_type: foundConversation.conversation_type,
      message_content: `${getUsername(user)} changed emoji to ${data.emoji}`,
      conversationId: data.conversationId,
      message_received: foundConversation.participants,
      message_content_type: MessageContentType.NOTIFY,
    };
    // Create new Message
    const message = await this.messageRepository.createMessageConversation(
      user,
      payload,
    );
    if (!message)
      throw new HttpException('Server Error', HttpStatus.INTERNAL_SERVER_ERROR);

    foundConversation.emoji = data.emoji;
    foundConversation.lastMessage = convertMessageWithIdToString(message);
    await foundConversation.save();

    return foundConversation;
  }

  // Private
  async checkUserIsAdmin(user: IUserCreated, conversation: any) {
    let isValid = false;
    for (let creator of conversation.creators) {
      if (creator.userId.toString() === user._id.toString() && creator.enable) {
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
