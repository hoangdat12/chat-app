import { Module } from '@nestjs/common';
import { ConversationController } from './conversation.controller';
import { ConversationService } from './conversation.service';
import { ConversationFactory } from './conversation.base';

@Module({
  providers: [ConversationService, ConversationFactory],
  controllers: [ConversationController],
})
export class ConversationModule {}
