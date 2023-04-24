import { Global, Module } from '@nestjs/common';
import { ConversationController } from './conversation.controller';
import { ConversationService } from './conversation.service';
import { ConversationFactory } from './conversation.base';
import { ConversationRepository } from './conversation.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { ConversationModel } from '../schema/model/conversation.model';
import { GroupModel } from '../schema/model/group.model';
import { MessageModule } from '../message/message.module';
@Global()
@Module({
  imports: [
    MongooseModule.forFeature([ConversationModel, GroupModel]),
    MessageModule,
  ],
  providers: [ConversationService, ConversationFactory, ConversationRepository],
  controllers: [ConversationController],
  exports: [ConversationRepository],
})
export class ConversationModule {}
