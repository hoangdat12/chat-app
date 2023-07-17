import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Query,
  Req,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from './user.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { Request } from 'express';
import { ChangeUsername } from '../auth/auth.dto';
import { Ok } from '../ultils/response';
import { IUserCreated } from '../ultils/interface';
import { multerOptions } from '../ultils/constant/multer.config';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async getAllUser() {
    try {
      return await this.userService.getAllUser();
    } catch (err) {
      throw err;
    }
  }

  @Get('/search')
  async searchUserByName(
    @Query('q') keyword: string,
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '20',
    @Query('sortBy') sortBy: string = 'name',
  ) {
    try {
      const parsedPage = parseInt(page, 10);
      const parsedLimit = parseInt(limit, 10);
      const pagination = {
        page: parsedPage,
        limit: parsedLimit,
        sortBy,
      };
      return new Ok(await this.userService.searchUser(keyword, pagination));
    } catch (err) {
      throw err;
    }
  }

  @Get('/:userId')
  async getUserDetail(@Param('userId') userId: string) {
    try {
      return await this.userService.getUserDetail(userId);
    } catch (err) {
      throw err;
    }
  }

  @Patch('change-username')
  async changeUsername(@Req() req: Request, @Body() data: ChangeUsername) {
    try {
      const user = req.user as IUserCreated;
      return await this.userService.changeUserName(user, data);
    } catch (err) {
      throw err;
    }
  }

  @Patch('change-avatar')
  @UseInterceptors(FileInterceptor('file', multerOptions))
  async changeAvatar(
    @Req() req: Request,
    @UploadedFile() file: Express.Multer.File,
  ) {
    try {
      const user = req.user as IUserCreated;
      const avatarUrl = `${process.env.IMAGE_URL}/${file.filename}`;

      return await this.userService.changeUserAvatar(user.email, avatarUrl);
    } catch (err) {}
  }

  @Get('/conversation/:userId')
  async getConversationOfUser(
    @Req() req: Request,
    @Param('userId') userId: string,
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '50',
    @Query('sortBy') sortBy: string = 'ctime',
  ) {
    const user = req.user as IUserCreated;
    const pagination = {
      page: parseInt(page),
      limit: parseInt(limit),
      sortBy: sortBy,
    };
    const conversations = await this.userService.getConversation(
      user,
      pagination,
    );
    const data = {
      conversations,
      page,
      limit,
      sortBy,
    };
    return new Ok<any>(data, 'success!');
  }
}
