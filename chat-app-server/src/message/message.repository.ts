import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  MessageConversation,
  MessageGroup,
} from '../schema/model/message.model';
import { Model } from 'mongoose';
import { PayloadCreateMessage } from './message.dto';

export interface IDataDeleteMessage {
  messageType: string;
  messageId: string;
  conversationId: string;
}

export interface IDateUpdateMessage extends IDataDeleteMessage {
  messageContent: string;
}

export interface Pagination {
  page: number;
  limit: number;
  sortBy: string;
}

@Injectable()
export class MessageRepository {
  constructor(
    @InjectModel(MessageConversation.name)
    private readonly messageConversationModel: Model<MessageConversation>,
    @InjectModel(MessageGroup.name)
    private readonly messageGroupModel: Model<MessageGroup>,
  ) {}

  // COMMON
  async get(type: string, messageId: string) {
    switch (type) {
      case 'conversation':
        return await this.messageConversationModel
          .findOne({ _id: messageId })
          .lean();
      case 'group':
        return await this.messageGroupModel.findOne({ _id: messageId }).lean();
      default:
        throw new HttpException('Type not found!', HttpStatus.BAD_REQUEST);
    }
  }
  // Xoa tam thoi
  async deleteConversation(
    type: string,
    conversationId: string,
    participantId: string,
  ) {
    switch (type) {
      case 'conversation':
        return await this.messageConversationModel.updateMany(
          {
            message_conversation: conversationId,
            message_received: {
              $elemMatch: {
                enable: true,
                userId: participantId.toString(),
              },
            },
          },
          { $set: { 'message_received.$[elem].enable': false } },
          {
            multi: true,
            arrayFilters: [{ 'elem.userId': participantId.toString() }],
          },
        );
      case 'group':
        return await this.messageGroupModel.updateMany(
          {
            message_group: conversationId,
            message_received: {
              $elemMatch: {
                enable: true,
                userId: participantId.toString(),
              },
            },
          },
          { $set: { 'message_received.$[elem].enable': false } },
          {
            multi: true,
            arrayFilters: [{ 'elem.userId': participantId.toString() }],
          },
        );
      default:
        throw new HttpException('Type not found', HttpStatus.BAD_REQUEST);
    }
  }
  // Xoa han
  async deleteConversationOfUser(
    type: string,
    userId: string,
    conversationId: string,
  ) {
    switch (type) {
      case 'conversation':
        return await this.messageConversationModel.updateMany(
          {
            message_conversation: conversationId,
            message_received: {
              $elemMatch: {
                enable: true,
                userId: userId.toString(),
              },
            },
          },
          {
            $pull: {
              message_received: {
                userId,
              },
            },
          },
          {
            multi: true,
          },
        );
      case 'group':
        return await this.messageGroupModel.updateMany(
          {
            message_group: conversationId,
            message_received: {
              $elemMatch: {
                enable: true,
                userId: userId.toString(),
              },
            },
          },
          { $set: { 'message_received.$[elem].enable': false } },
          {
            multi: true,
            arrayFilters: [{ 'elem.userId': userId.toString() }],
          },
        );
      default:
        throw new HttpException('Type not found', HttpStatus.BAD_REQUEST);
    }
  }
  async findMessageOfConversation(
    type: string,
    userId: string,
    conversationId: string,
    pagination: Pagination,
  ) {
    const { page, limit, sortBy } = pagination;
    const offset = (page - 1) * limit;
    switch (type) {
      case 'conversation':
        return await this.messageConversationModel
          .find({
            message_conversation: conversationId,
            message_received: {
              $elemMatch: {
                enable: true,
                userId: userId.toString(),
              },
            },
          })
          .limit(limit)
          .skip(offset)
          .sort(sortBy === 'ctime' ? { createdAt: -1 } : { id: 1 })
          .lean()
          .exec();
      case 'group':
        return await this.messageGroupModel
          .find({
            message_group: conversationId,
            message_received: {
              $elemMatch: {
                enable: true,
                userId: userId.toString(),
              },
            },
          })
          .limit(limit)
          .skip(offset)
          .sort(sortBy === 'ctime' ? { createdAt: -1 } : { id: 1 })
          .lean()
          .exec();
      default:
        throw new HttpException('Type not found!', HttpStatus.BAD_REQUEST);
    }
  }

  async updateMessage(data: IDateUpdateMessage) {
    switch (data.messageType) {
      case 'conversation':
        return await this.messageConversationModel.findOneAndUpdate(
          { _id: data.messageId },
          { message_content: data.messageContent },
          { new: true },
        );
      case 'group':
        return await this.messageGroupModel.findOneAndUpdate(
          { _id: data.messageId },
          { message_content: data.messageContent },
          { new: true },
        );
      default:
        throw new HttpException('Type not found', HttpStatus.BAD_REQUEST);
    }
  }

  async delete(data: IDataDeleteMessage) {
    switch (data.messageType) {
      case 'conversation':
        return await this.messageConversationModel.deleteOne({
          _id: data.messageId,
          message_conversation: data.conversationId,
        });
      case 'group':
        return await this.messageGroupModel.deleteOne({
          _id: data.messageId,
          message_group: data.conversationId,
        });
      default:
        throw new HttpException('Type not found!', HttpStatus.BAD_REQUEST);
    }
  }

  // CONVERSATION MESSAGE

  async getConversationMessage(messageId: string) {
    return await this.messageConversationModel
      .findOne({ _id: messageId })
      .lean();
  }

  async createMessageConversation(data: PayloadCreateMessage) {
    const { message_type_model, ...payload } = data;
    return await this.messageConversationModel.create({
      ...payload,
      message_conversation: message_type_model,
    });
  }

  // GROUP MESSAGE
  async getGroupMessage(messageId: string) {
    return await this.messageGroupModel.findOne({ _id: messageId }).lean();
  }

  async createMessageGroup(data: PayloadCreateMessage) {
    const { message_type_model, ...payload } = data;
    return await this.messageGroupModel.create({
      ...payload,
      message_group: message_type_model,
    });
  }
}
