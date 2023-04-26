import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Conversation, IParticipant } from '../schema/model/conversation.model';
import { Group } from '../schema/model/group.model';
import { UserJoinChat } from 'src/message/message.dto';

export interface IPayloadCreateConversation {
  conversation_type: string;
  participants: IParticipant[];
  lastMessage: string | null;
  lastMessageSendAt: Date | null;
}

export interface IPayloadCreateGroup {
  conversation_type: string;
  participants: IParticipant[];
  lastMessage: string | null;
  lastMessageSendAt: Date | null;
  creators: UserJoinChat[] | null;
  name: string | null;
}

@Injectable()
export class ConversationRepository {
  constructor(
    @InjectModel(Conversation.name)
    private readonly conversationModel: Model<Conversation>,
    @InjectModel(Group.name) private readonly groupModel: Model<Group>,
  ) {}

  // COMMON
  async findById(type: string, conversationId: string) {
    switch (type) {
      case 'conversation':
        return await this.findConversationById(conversationId);
      case 'group':
        return await this.findGroupById(conversationId);
      default:
        throw new HttpException('Type not found', HttpStatus.BAD_REQUEST);
    }
  }

  async findByIdWithMethodSave(type: string, conversationId: string) {
    switch (type) {
      case 'conversation':
        return await this.conversationModel.findOne({ _id: conversationId });
      case 'group':
        return await this.groupModel.findOne({ _id: conversationId });
      default:
        throw new HttpException('Type not found', HttpStatus.BAD_REQUEST);
    }
  }

  async changeTopicConversation(
    type: string,
    conversationId: string,
    topic: string,
  ) {
    switch (type) {
      case 'conversation':
        return await this.conversationModel.findOneAndUpdate(
          { _id: conversationId },
          { topic },
          { new: true },
        );
      case 'group':
        return await this.groupModel.findOneAndUpdate(
          { _id: conversationId },
          { topic },
          { new: true },
        );
      default:
        throw new HttpException('Type not found', HttpStatus.BAD_REQUEST);
    }
  }

  // CONVERSATION
  async findConversationById(conversationId: string) {
    return await this.conversationModel.findOne({ _id: conversationId }).lean();
  }

  async createConversation(
    userId: string,
    payload: IPayloadCreateConversation,
  ) {
    payload.participants = this.modifyDataPaticipants(
      payload.participants,
      userId,
    );
    return await this.conversationModel.create(payload);
  }

  async updateLastConversationMessage(conversationId: string, content: string) {
    return await this.conversationModel.findOneAndUpdate(
      { _id: conversationId },
      {
        lastMessage: content,
        lastMessageSendAt: Date.now(),
        $set: { 'participants.$[].isReadLastMessage': false },
      },
      { new: true },
    );
  }

  // GROUP
  async findGroupById(groupId: string) {
    return await this.groupModel.findOne({ _id: groupId }).lean();
  }

  async createGroup(payload: IPayloadCreateGroup) {
    const { name, ...data } = payload;
    data.participants = this.modifyDataPaticipants(
      data.participants,
      data.creators[0].userId,
    );
    return await this.groupModel.create({ ...data, nameGroup: name });
  }

  async updateLastGroupMessage(conversationId: string, content: string) {
    return await this.groupModel.findOneAndUpdate(
      { _id: conversationId },
      { lastMessage: content, lastMessageSendAt: Date.now() },
      { new: true },
    );
  }

  async renameGroup(conversationId: string, nameGroup: string) {
    return await this.groupModel.findOneAndUpdate(
      { _id: conversationId },
      { nameGroup },
      { new: true },
    );
  }

  // Kik user out of group
  async deletePaticipantOfGroup(conversationId: string, participantId: string) {
    return await this.groupModel.findOneAndUpdate(
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
    paticipant: UserJoinChat,
  ) {
    return await this.groupModel.findOneAndUpdate(
      { _id: conversationId },
      {
        $push: {
          participants: {
            paticipant,
          },
        },
      },
      { new: true },
    );
  }

  async addPaticipantOfExistInConversation(
    conversationId: string,
    participantId: string,
  ) {
    return await this.groupModel.findOneAndUpdate(
      {
        _id: conversationId,
        participants: { $elemMatch: { userId: participantId } },
      },
      {
        $set: {
          'participants.$.enable': true,
        },
      },
      { new: true },
    );
  }

  // ULTILS
  modifyDataPaticipants(participants: IParticipant[], userId: string) {
    for (let participant of participants) {
      if (participant.userId === userId) {
        participant.isReadLastMessage = true;
      } else {
        participant.isReadLastMessage = false;
      }
      participant.enable = true;
    }
    return participants;
  }
}
