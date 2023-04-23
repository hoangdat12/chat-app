import { Module } from '@nestjs/common';
import { ConversationController } from './conversation.controller';
import { ConversationService } from './conversation.service';
import { ConversationFactory } from './conversation.base';
import { ConversationRepository } from './conversation.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { ConversationModel } from '../schema/model/conversation.model';
import { GroupModel } from '../schema/model/group.model';

@Module({
  imports: [MongooseModule.forFeature([ConversationModel, GroupModel])],
  providers: [ConversationService, ConversationFactory, ConversationRepository],
  controllers: [ConversationController],
  exports: [ConversationRepository],
})
export class ConversationModule {}
