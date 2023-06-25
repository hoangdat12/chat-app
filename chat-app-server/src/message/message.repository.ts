import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Messages } from '../schema/model/message.model';
import { Model } from 'mongoose';
import { PayloadCreateMessage } from './message.dto';
import { Pagination } from '../ultils/interface';

export interface IDataDeleteMessage {
  messageType: string;
  messageId: string;
  conversationId: string;
}

export interface IDateUpdateMessage extends IDataDeleteMessage {
  messageContent: string;
}

@Injectable()
export class MessageRepository {
  constructor(
    @InjectModel(Messages.name)
    private readonly messageModel: Model<Messages>,
  ) {}

  // COMMON
  async findById(messageId: string) {
    return await this.messageModel.findById(messageId).lean();
  }
  // Xoa tam thoi
  async deleteConversation(conversationId: string, participantId: string) {
    return await this.messageModel.updateMany(
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
  }
  // Xoa han
  async deleteConversationOfUser(userId: string, conversationId: string) {
    return await this.messageModel.updateMany(
      {
        message_conversation: conversationId,
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
  }

  async findMessageOfConversation(
    userId: string,
    conversationId: string,
    pagination: Pagination,
  ) {
    const { page, limit, sortBy } = pagination;
    const offset = (page - 1) * limit;
    return await this.messageModel
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
  }

  async updateMessage(data: IDateUpdateMessage) {
    return await this.messageModel.findOneAndUpdate(
      { _id: data.messageId },
      { message_content: data.messageContent },
      { new: true },
    );
  }

  async delete(data: IDataDeleteMessage) {
    return await this.messageModel.deleteOne({
      _id: data.messageId,
      message_conversation: data.conversationId,
    });
  }

  async createMessageConversation(data: PayloadCreateMessage) {
    const { conversationId, ...payload } = data;
    return await this.messageModel.create({
      ...payload,
      message_conversation: conversationId,
    });
  }
}
