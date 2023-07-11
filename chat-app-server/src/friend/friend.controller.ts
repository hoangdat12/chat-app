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
import { Ok } from 'src/ultils/response';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Controller('friend')
export class FriendController {
  constructor(
    private readonly friendService: FriendService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  @Post('')
  create(@Req() req: Request) {
    try {
      const user = req.user as IUserCreated;
      return this.friendService.create(user);
    } catch (error) {
      throw error;
    }
  }

  @Get()
  async getListFriendAndUnConfirmedOfUser(
    @Req() req: Request,
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '20',
    @Query('sortBy') sortBy: string = 'name',
  ) {
    try {
      const user = req.user as IUserCreated;
      const pagination = {
        page: parseInt(page),
        limit: parseInt(limit),
        sortBy: sortBy,
      };
      return new Ok(
        await this.friendService.getFriendAndUnConfirmedOfUser(
          user,
          pagination,
        ),
      );
    } catch (error) {
      throw error;
    }
  }

  @Get('/friends')
  async getListFriendOfUser(
    @Req() req: Request,
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '20',
    @Query('sortBy') sortBy: string = 'name',
  ) {
    try {
      const user = req.user as IUserCreated;
      const pagination = {
        page: parseInt(page),
        limit: parseInt(limit),
        sortBy: sortBy,
      };
      return new Ok(await this.friendService.getListFriend(user, pagination));
    } catch (error) {
      throw error;
    }
  }

  @Get('/uncofirmed')
  async getListUnConfirmedOfUser(
    @Req() req: Request,
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '20',
    @Query('sortBy') sortBy: string = 'name',
  ) {
    try {
      const user = req.user as IUserCreated;
      const pagination = {
        page: parseInt(page),
        limit: parseInt(limit),
        sortBy: sortBy,
      };
      return new Ok(
        await this.friendService.getListUnConfirmed(user, pagination),
      );
    } catch (error) {
      throw error;
    }
  }

  @Get('/search')
  async findByName(
    @Req() req: Request,
    @Query('q') keyword: string,
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '20',
    @Query('sortBy') sortBy: string = 'name',
  ) {
    try {
      const user = req.user as IUserCreated;
      const pagination = {
        page: parseInt(page),
        limit: parseInt(limit),
        sortBy: sortBy,
      };
      return new Ok(
        await this.friendService.findFriend(user, keyword, pagination),
      );
    } catch (error) {
      throw error;
    }
  }

  @Get('/status/:friendId')
  async statusFriend(@Req() req: Request, @Param('friendId') friendId: string) {
    try {
      const user = req.user as IUserCreated;
      return new Ok(await this.friendService.statusFriend(user, friendId));
    } catch (error) {
      throw error;
    }
  }

  @Post('/add')
  async addFriend(@Req() req: Request, @Body('friend') friend: IFriend) {
    try {
      const user = req.user as IUserCreated;
      const data = await this.friendService.addFriend(user, friend);
      // add friend success
      if (data.status === 'Cancel') {
        this.eventEmitter.emit('friend.received.add', { user, friend });
      } else if (data.status === 'Add Friend') {
        this.eventEmitter.emit('friend.user.cancel', { user, friend });
      }
      return new Ok(data);
    } catch (error) {
      throw error;
    }
  }

  @Post('/confirm')
  async confirmFriend(@Req() req: Request, @Body('friend') friend: IFriend) {
    try {
      const user = req.user as IUserCreated;
      return new Ok(await this.friendService.confirmFriend(user, friend));
    } catch (error) {
      throw error;
    }
  }

  @Post('/refuse')
  async refuseFriend(@Req() req: Request, @Body('friend') friend: IFriend) {
    try {
      const user = req.user as IUserCreated;
      return new Ok(await this.friendService.refuseFriend(user, friend));
    } catch (error) {
      throw error;
    }
  }

  @Get('/total-notify')
  async getNotifyAddFriend(@Req() req: Request) {
    try {
      const user = req.user as IUserCreated;
      return new Ok(await this.friendService.getNotifyAddFriend(user));
    } catch (error) {
      throw error;
    }
  }
}
