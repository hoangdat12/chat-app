import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Conversation } from '../schema/model/conversation.model';
import { UserJoinChat } from '../message/message.dto';
import {
  IMessage,
  IParticipant,
  IUserCreated,
  Pagination,
} from '../ultils/interface';
import { PayloadCreateConversation } from './conversation.dto';

@Injectable()
export class ConversationRepository {
  constructor(
    @InjectModel(Conversation.name)
    private readonly conversationModel: Model<Conversation>,
  ) {}

  // COMMON
  async findById(conversationId: string) {
    return await this.conversationModel.findById(conversationId);
  }

  async findUserExist(conversationId: string, userId: string) {
    return await this.conversationModel.findOne({
      _id: conversationId,
      'participants.userId': userId.toString(),
      'participants.enable': true,
    });
  }

  async changeTopicConversation(conversationId: string, topic: string) {
    return await this.conversationModel.findOneAndUpdate(
      { _id: conversationId },
      { topic },
      { new: true },
    );
  }

  async findALl(userId: string, pagination: Pagination) {
    const { page, limit } = pagination;
    const offset = (page - 1) * limit;
    return await this.conversationModel.aggregate([
      {
        $match: {
          'participants.userId': userId.toString(),
        },
      },
      {
        $project: {
          _id: 1,
          conversation_type: 1,
          creators: 1,
          participants: 1,
          lastMessage: 1,
          lastMessageSendAt: 1,
          updatedAt: 1,
          nameGroup: 1,
          avatarUrl: 1,
          userId: '$participants.userId',
          collection: { $literal: 'Conversation' },
        },
      },
      {
        $unionWith: {
          coll: 'Group',
          pipeline: [
            { $match: { 'participants.userId': userId.toString() } },
            {
              $project: {
                _id: 1,
                conversation_type: 1,
                creators: 1,
                nameGroup: 1,
                participants: 1,
                lastMessage: 1,
                lastMessageSendAt: 1,
                updatedAt: 1,
                userId: '$participants.userId',
                collection: { $literal: 'Group' },
              },
            },
          ],
        },
      },
      { $sort: { updatedAt: -1 } },
      { $skip: offset },
      { $limit: limit },
    ]);
  }

  async createConversation(payload: PayloadCreateConversation) {
    for (let participant of payload.participants) {
      participant.enable = true;
      participant.isReadLastMessage = false;
    }
    return await this.conversationModel.create(payload);
  }

  async findConversationOfUser(userId: string, pagination: Pagination) {
    const { page, limit, sortBy } = pagination;
    const offset = (page - 1) * limit;
    const conversations = await this.conversationModel
      .find({
        'participants.userId': userId,
      })
      .sort(sortBy === 'ctime' ? { createdAt: -1 } : { createdAt: 1 })
      .skip(offset)
      .limit(limit)
      .lean()
      .exec();
    console.log('conversations:::: ', conversations);
    return conversations;
  }

  async updateLastConversationMessage(
    conversationId: string,
    message: IMessage,
  ) {
    return await this.conversationModel.findOneAndUpdate(
      { _id: conversationId },
      {
        lastMessage: message,
        lastMessageSendAt: Date.now(),
        $set: { 'participants.$[].isReadLastMessage': false },
      },
      { new: true },
    );
  }

  async renameGroup(conversationId: string, nameGroup: string) {
    return await this.conversationModel.findOneAndUpdate(
      { _id: conversationId },
      { nameGroup },
      { new: true },
    );
  }

  // Kik user out of group
  async deletePaticipantOfGroup(conversationId: string, participantId: string) {
    return await this.conversationModel.findOneAndUpdate(
      {
        _id: conversationId,
        participants: { $elemMatch: { userId: participantId } },
      },
      {
        $set: {
          'participants.$.enable': false,
        },
      },
      { new: true },
    );
  }

  // Check user is exist in conversation
  // if exist then set Inable true
  // else add new Member
  async addPaticipantOfConversation(
    conversationId: string,
    participants: IParticipant[],
  ) {
    return await this.conversationModel.findOneAndUpdate(
      {
        _id: conversationId,
      },
      {
        $push: {
          participants: { $each: participants },
        },
      },
      {
        new: true,
      },
    );
  }

  async addPaticipantOfExistInConversation(
    conversationId: string,
    participantIds: string[],
  ) {
    await this.conversationModel.updateMany(
      {
        _id: conversationId,
        'participants.userId': { $in: participantIds },
      },
      {
        $set: {
          'participants.$[elem].enable': true,
        },
      },
      {
        arrayFilters: [{ 'elem.userId': { $in: participantIds } }],
        new: true,
      },
    );
  }

  async deleteConversation(conversationId: string) {
    return await this.conversationModel.deleteOne({ _id: conversationId });
  }

  async readLastMessage(user: IUserCreated, conversationId: string) {
    return await this.conversationModel.findOneAndUpdate(
      {
        _id: conversationId,
        'participants.userId': user._id,
        'participants.isReadLastMessage': false,
      },
      {
        $set: {
          'participants.$.isReadLastMessage': true,
        },
      },
      {
        new: true,
        upsert: true,
      },
    );
  }

  // ULTILS
  modifyDataPaticipants(participants: IParticipant[], userId: string) {
    for (let participant of participants) {
      if (participant.userId === userId.toString()) {
        participant.isReadLastMessage = true;
      } else {
        participant.isReadLastMessage = false;
      }
      participant.enable = true;
    }
    return participants;
  }
}
