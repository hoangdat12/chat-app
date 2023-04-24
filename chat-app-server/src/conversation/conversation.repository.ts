import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Conversation } from '../schema/model/conversation.model';
import { Group } from '../schema/model/group.model';
import { Received, UserSenderMessage } from 'src/message/message.dto';

export interface IPayloadCreateConversation {
  conversation_type: string;
  participants: UserSenderMessage[];
  lastMessage: string | null;
  lastMessageSendAt: Date | null;
}

export interface IPayloadCreateGroup {
  conversation_type: string;
  participants: UserSenderMessage[];
  lastMessage: string | null;
  lastMessageSendAt: Date | null;
  creators: UserSenderMessage[] | null;
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

  // CONVERSATION
  async findConversationById(conversationId: string) {
    return await this.conversationModel.findOne({ _id: conversationId }).lean();
  }

  async createConversation(payload: IPayloadCreateConversation) {
    return await this.conversationModel.create(payload);
  }

  async updateLastConversationMessage(conversationId: string, content: string) {
    return await this.conversationModel.findOneAndUpdate(
      { _id: conversationId },
      { lastMessage: content, lastMessageSendAt: Date.now() },
      { new: true },
    );
  }

  // GROUP
  async findGroupById(groupId: string) {
    return await this.groupModel.findOne({ _id: groupId }).lean();
  }

  async createGroup(payload: IPayloadCreateGroup) {
    const { name, ...data } = payload;
    data.participants = this.modifyDataPaticipants(data.participants);
    return await this.groupModel.create({ ...data, nameGroup: name });
  }

  async updateLastGroupMessage(conversationId: string, content: string) {
    return await this.groupModel.findOneAndUpdate(
      { _id: conversationId },
      { lastMessage: content, lastMessageSendAt: Date.now() },
      { new: true },
    );
  }

  async deletePaticipantOfGroup(conversationId: string, participantId: string) {
    return await this.groupModel.findOneAndUpdate(
      { _id: conversationId },
      {
        $pull: {
          participants: {
            userId: participantId,
          },
        },
      },
      { new: true },
    );
  }

  // ULTILS
  modifyDataPaticipants(paticipants: Received[]) {
    let result = [];
    for (let paticipant of paticipants) {
      result.push({ ...paticipant, enable: true });
    }
    return result;
  }
}
