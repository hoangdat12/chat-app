import { Global, Module } from '@nestjs/common';
import { MessageService } from './message.service';
import { MessageController } from './message.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { MessagesModel } from '../schema/model/message.model';
import { MessageFactory } from './message.base';
import { MessageRepository } from './message.repository';
import { ConversationModule } from '../conversation/conversation.module';

@Module({
  imports: [
    MongooseModule.forFeature([MessagesModel]),
    // ConversationModule,
  ],
  providers: [MessageService, MessageFactory, MessageRepository],
  controllers: [MessageController],
  exports: [MessageRepository],
})
export class MessageModule {}
