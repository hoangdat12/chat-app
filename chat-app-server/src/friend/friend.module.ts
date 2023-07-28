import { Module } from '@nestjs/common';
import { FriendService } from './friend.service';
import { FriendController } from './friend.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { FriendModel } from '../schema/friend.model';
import { FriendRepository } from './friend.repository';
import { NotifyModule } from '../notify/notify.module';
import { RedisModule } from '../redis/redis.module';

@Module({
  imports: [
    MongooseModule.forFeature([FriendModel]),
    NotifyModule,
    RedisModule,
  ],
  controllers: [FriendController],
  providers: [FriendService, FriendRepository],
  exports: [FriendService],
})
export class FriendModule {}
