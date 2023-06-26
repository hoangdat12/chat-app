import { Module, forwardRef } from '@nestjs/common';
import { MessageService } from './message.service';
import { MessageController } from './message.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { MessagesModel } from '../schema/model/message.model';
import { MessageRepository } from './message.repository';
import { ConversationModule } from '../conversation/conversation.module';
@Module({
  imports: [
    MongooseModule.forFeature([MessagesModel]),
    forwardRef(() => ConversationModule),
  ],
  providers: [MessageService, MessageRepository],
  controllers: [MessageController],
  exports: [MessageRepository],
})
export class MessageModule {}
