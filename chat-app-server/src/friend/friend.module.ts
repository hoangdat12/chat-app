import { Module } from '@nestjs/common';
import { FriendService } from './friend.service';
import { FriendController } from './friend.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { FriendModel } from '../schema/friend.model';
import { FriendRepository } from './friend.repository';

@Module({
  imports: [MongooseModule.forFeature([FriendModel])],
  controllers: [FriendController],
  providers: [FriendService, FriendRepository],
  exports: [FriendService],
})
export class FriendModule {}
