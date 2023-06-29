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

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async getAllUser() {
    try {
      return await this.userService.getAllUser();
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  @Get('/:userId')
  async getUserDetail(@Param('userId') userId: string) {
    try {
      return await this.userService.getUserDetail(userId);
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  @Patch('change-username')
  async changeUsername(@Req() req: Request, @Body() data: ChangeUsername) {
    try {
      const user = req.user as IUserCreated;
      return await this.userService.changeUserName(user, data);
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  @Patch('change-avatar')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './public/assets',
        filename: (req, file, cb) => {
          const randomName = Array(32)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join('');
          cb(null, `${randomName}${extname(file.originalname)}`);
        },
      }),
    }),
  )
  async changeAvatar(
    @Req() req: Request,
    @UploadedFile() file: Express.Multer.File,
  ) {
    try {
      const user = req.user as IUserCreated;
      const avatarUrl = `${process.env.IMAGE_URL}/${file.filename}`;

      return await this.userService.changeUserAvatar(user.email, avatarUrl);
    } catch (err) {
      console.log(err);
    }
  }

  @Get('/conversation/:userId')
  async getConversationOfUser(
    @Req() req: Request,
    @Param('userId') userId: string,
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('sortBy') sortBy: string,
  ) {
    const user = req.user as IUserCreated;
    const pagination = {
      page: page || 1,
      limit: limit || 50,
      sortBy: sortBy || 'ctime',
    };
    const conversations = await this.userService.getConversation(
      user,
      pagination,
    );
    console.log(conversations);
    const data = {
      conversations,
      page,
      limit,
      sortBy,
    };
    return new Ok<any>(data, 'success!');
  }
}
