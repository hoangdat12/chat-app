import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Conversation } from '../schema/model/conversation.model';
import { Group } from '../schema/model/group.model';
import { UserSenderMessage } from 'src/message/message.dto';

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
  creator: UserSenderMessage | null;
  name: string | null;
}

@Injectable()
export class ConversationRepository {
  constructor(
    @InjectModel(Conversation.name)
    private readonly conversationModel: Model<Conversation>,
    @InjectModel(Group.name) private readonly groupModel: Model<Group>,
  ) {}

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

  async findConversationById(conversationId: string) {
    return await this.conversationModel.findById(conversationId).lean();
  }

  async findGroupById(groupId: string) {
    return await this.groupModel.findById(groupId).lean();
  }

  async createConversation(payload: IPayloadCreateConversation) {
    return await this.conversationModel.create(payload);
  }

  async createGroup(payload: IPayloadCreateGroup) {
    return await this.groupModel.create(payload);
  }
}
