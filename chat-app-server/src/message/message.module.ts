import { Global, Module } from '@nestjs/common';
import { MessageService } from './message.service';
import { MessageController } from './message.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  MessageConversationModel,
  MessageGroupModel,
} from '../schema/model/message.model';
import { MessageFactory } from './message.base';
import { MessageRepository } from './message.repository';
import { ConversationModule } from '../conversation/conversation.module';

@Module({
  imports: [
    MongooseModule.forFeature([MessageConversationModel, MessageGroupModel]),
    // ConversationModule,
  ],
  providers: [MessageService, MessageFactory, MessageRepository],
  controllers: [MessageController],
  exports: [MessageRepository],
})
export class MessageModule {}
