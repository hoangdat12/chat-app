import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { ConversationModule } from '../conversation/conversation.module';
import { RedisModule } from '../redis/redis.module';

@Module({
  imports: [ConversationModule, RedisModule],
  providers: [UserService],
  controllers: [UserController],
})
export class UserModule {}
