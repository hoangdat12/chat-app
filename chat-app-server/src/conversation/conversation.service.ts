import { MessageRepository } from '../message/message.repository';
import { ConversationRepository } from './conversation.repository';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { IParticipant, IUserCreated, Pagination } from '../ultils/interface';
import {
  ChangeNickNameOfParticipant,
  ChangeTopic,
  GetDeleteMessageOfConversation,
  PayloadAddPaticipant,
  PayloadCreateConversation,
  PayloadDeletePaticipant,
  RenameGroup,
} from './conversation.dto';
import { MessageType } from '../ultils/constant';

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
    const creator = {
      userId: user._id,
      email: user.email,
      avatarUrl: user.avatarUrl,
      userName: `${user.firstName} ${user.lastName}`,
    };
    payload.creators = [creator];
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

    return await this.messageRepository.deleteConversation(
      conversationId,
      user._id,
    );
  }

  // Kick user from conversation
  async deletePaticipantOfConversation(
    user: IUserCreated,
    data: PayloadDeletePaticipant,
  ) {
    const { participantId, conversationId } = data;
    const foundConversation = await this.conversationRepository.findUserExist(
      conversationId,
      user._id,
    );
    if (!foundConversation)
      throw new HttpException('Conversation not found!', HttpStatus.NOT_FOUND);

    let isValid = false;
    for (let creator of foundConversation.creators) {
      if (creator.userId.toString() === user._id.toString()) {
        isValid = true;
        break;
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

    return await this.conversationRepository.deletePaticipantOfGroup(
      conversationId,
      participantId,
    );
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
    let userExistConversation: IParticipant[] = [];
    let newMember: IParticipant[] = [];
    for (let newer of newParticipants) {
      for (let participant of foundConversation.participants) {
        // If user exist in conversation
        if (participant.userId === newer.userId) {
          // If user was deleted from group then enable user
          if (!participant.enable) {
            participant.enable = true;
            userExistConversation.push(newer);
          }
          continue;
        }
      }
      // If user not exist in conversation
      newer.enable = true;
      newer.isReadLastMessage = false;
      newMember.push(newer);
    }

    if (userExistConversation.length > 0) {
      await foundConversation.save();
    }

    if (newMember.length > 0) {
      this.conversationRepository.addPaticipantOfConversation(
        conversationId,
        newMember,
      );
    }

    return 'Add new member successfully!';
  }

  async setNickNameForParticipant(
    user: IUserCreated,
    data: ChangeNickNameOfParticipant,
  ) {
    let { newNicknameOfUser, conversationId } = data;

    const foundConversation = await this.conversationRepository.findUserExist(
      conversationId,
      user._id,
    );

    if (!foundConversation)
      throw new HttpException('Conversation not found!', HttpStatus.NOT_FOUND);

    for (let participant of foundConversation.participants) {
      newNicknameOfUser = newNicknameOfUser.filter((changer) => {
        if (participant.userId === changer.userId) {
          participant.userName = changer.userName;
          return false;
        }
        return true;
      });
      if (newNicknameOfUser.length <= 0) break;
    }

    foundConversation.save();
    return foundConversation;
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

    return await this.conversationRepository.renameGroup(
      conversationId,
      nameGroup,
    );
  }
}
