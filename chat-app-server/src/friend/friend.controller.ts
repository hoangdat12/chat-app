import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  Query,
} from '@nestjs/common';
import { FriendService } from './friend.service';
import { IUserCreated } from '../ultils/interface';
import { IFriend } from '../ultils/interface/friend.interface';
import { Request } from 'express';

@Controller('friend')
export class FriendController {
  constructor(private readonly friendService: FriendService) {}

  @Post('')
  create(@Req() req: Request) {
    const user = req.user as IUserCreated;
    return this.friendService.create(user);
  }

  @Get()
  getListFriend(
    @Req() req: Request,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 20,
    @Query('sortBy') sortBy: string = 'name',
  ) {
    const user = req.user as IUserCreated;
    const pagination = {
      page,
      limit,
      sortBy,
    };
    return this.friendService.getListFriend(user, pagination);
  }

  @Post('/add')
  addFriend(@Req() req: Request, @Body('friend') friend: IFriend) {
    const user = req.user as IUserCreated;
    return this.friendService.addFriend(user, friend);
  }

  @Post('/confirm')
  confirmFriend(@Req() req: Request, @Body('friend') friend: IFriend) {
    const user = req.user as IUserCreated;
    return this.friendService.confirmFriend(user, friend);
  }

  @Delete('/refuse')
  refuseFriend(@Req() req: Request, @Body('friend') friend: IFriend) {
    const user = req.user as IUserCreated;
    return this.friendService.refuseFriend(user, friend);
  }
}
