import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  MessageConversation,
  MessageGroup,
} from '../schema/model/message.model';
import { Model } from 'mongoose';
import { PayloadCreateMessage } from './message.dto';

@Injectable()
export class MessageRepository {
  constructor(
    @InjectModel(MessageConversation.name)
    private readonly messageConversationModel: Model<MessageConversation>,
    @InjectModel(MessageGroup.name)
    private readonly messageGroupModel: Model<MessageGroup>,
  ) {}

  async createMessageConversation(data: PayloadCreateMessage) {
    return await this.messageConversationModel.create(data);
  }

  async createMessageGroup(data: PayloadCreateMessage) {
    return await this.messageGroupModel.create(data);
  }
}
