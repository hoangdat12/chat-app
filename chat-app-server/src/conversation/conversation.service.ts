import { MessageRepository } from 'src/message/message.repository';
import { ConversationRepository } from './conversation.repository';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { IParticipant, IUserCreated, Pagination } from 'src/ultils/interface';
import {
  ChangeNickNameOfParticipant,
  ChangeTopic,
  GetDeleteMessageOfConversation,
  PayloadAddPaticipant,
  PayloadCreateConversation,
  PayloadDeletePaticipant,
  RenameGroup,
} from './conversation.dto';
import { MessageType } from 'src/ultils/constant';

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

    return await this.messageRepository.findMessageOfConversation(
      user._id,
      conversationId,
      pagination,
    );
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
  // async addPaticipantOfConversation(
  //   user: IUserCreated,
  //   data: PayloadAddPaticipant,
  // ) {
  //   const { conversation_type, conversationId, participant } = data;
  //   if (conversation_type !== MessageType.GROUP) {
  //     return;
  //   }

  //   const foundConversation = await this.conversationRepository.findUserExist(
  //     conversationId,
  //     user._id,
  //   );
  //   if (!foundConversation)
  //     throw new HttpException('Conversation not found!', HttpStatus.NOT_FOUND);

  //   // Check user is exist in participant or not
  //   let userExistConversation: IParticipant[] = [];
  //   let newMember: IParticipant[] = [];
  //   for (let participant of foundConversation.participants) {
  //     if (participant.userId === user._id) {
  //       userExistConversation.push(participant);
  //     } else {
  //       newMember.push(participant);
  //     }
  //   }

  //   let updateParticipantGroup: IParticipant[] = [];
  //   let participantIds = [];
  //   // If user is conversation but is deleted
  //   if (userExistConversation.length > 0) {
  //     userExistConversation = userExistConversation.filter((userExist) => {
  //       // delete user exist with enable true
  //       if (userExist.enable === true) {
  //         return false;
  //       } else {
  //         participantIds.push(userExist.userId);
  //       }
  //     });
  //   }

  //   // update enable is true
  //   if (participantIds.length > 0) {
  //     const updateUserExist =
  //       await this.conversationRepository.addPaticipantOfExistInConversation(
  //         conversationId,
  //         participantIds,
  //       );
  //   }

  //   if (newMember.length > 0) {
  //     const addNewMember =
  //       await this.conversationRepository.addPaticipantOfConversation(
  //         conversationId,
  //         newMember,
  //       );
  //   }

  //   return updateParticipantGroup;
  // }

  async addPaticipantOfConversation(user, data) {
    const { conversation_type, conversationId, participant } = data;

    // Check if the conversation type is not GROUP, return early
    if (conversation_type !== MessageType.GROUP) {
      return;
    }

    // Find the conversation and check if it exists
    const foundConversation = await this.conversationRepository.findUserExist(
      conversationId,
      user._id,
    );
    if (!foundConversation) {
      throw new HttpException('Conversation not found!', HttpStatus.NOT_FOUND);
    }

    let userExistConversation = [];
    let newMember = [];

    // Separate existing participants from new participants
    for (let participant of foundConversation.participants) {
      if (participant.userId === user._id) {
        userExistConversation.push(participant);
      } else {
        newMember.push(participant);
      }
    }

    let participantIds = [];

    // Filter out existing participants who are marked as deleted
    if (userExistConversation.length > 0) {
      userExistConversation = userExistConversation.filter((userExist) => {
        if (userExist.enable === true) {
          return false;
        } else {
          participantIds.push(userExist.userId);
          return true;
        }
      });
    }

    const updatePromise =
      participantIds.length > 0
        ? this.conversationRepository.addPaticipantOfExistInConversation(
            conversationId,
            participantIds,
          )
        : Promise.resolve();

    const addPromise =
      newMember.length > 0
        ? this.conversationRepository.addPaticipantOfConversation(
            conversationId,
            newMember,
          )
        : Promise.resolve();

    // Await both update and add promises concurrently
    await Promise.all([updatePromise, addPromise]);

    // Return the existing participants
    return 'Add member successfully!';
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
