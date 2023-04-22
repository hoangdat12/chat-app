import { Module } from '@nestjs/common';
import { MessageService } from './message.service';
import { MessageController } from './message.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { MessageConversationModel } from '../schema/model/message.model';
import { MessageFactory } from './message.base';
import { MessageRepository } from './message.repository';

@Module({
  imports: [MongooseModule.forFeature([MessageConversationModel])],
  providers: [MessageService, MessageFactory, MessageRepository],
  controllers: [MessageController],
})
export class MessageModule {}
