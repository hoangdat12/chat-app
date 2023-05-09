import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { ConversationModule } from '../conversation/conversation.module';

@Module({
  imports: [ConversationModule],
  providers: [UserService],
  controllers: [UserController],
})
export class UserModule {}
