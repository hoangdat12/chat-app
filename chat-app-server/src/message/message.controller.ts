import {
  Body,
  Controller,
  Delete,
  Param,
  Patch,
  Post,
  Req,
} from '@nestjs/common';
import {
  CreateMessageData,
  DelelteMessageData,
  UpdateMessageData,
} from './message.dto';
import { MessageService } from './message.service';
import { IUserCreated } from '../auth/repository/auth.repository';
import { Request } from 'express';

@Controller('message')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}
  @Post()
  async createMessage(@Req() req: Request, @Body() body: CreateMessageData) {
    try {
      const user = req.user as IUserCreated;
      return await this.messageService.createMessage(user, body);
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  @Patch('/:messageId')
  async updateMessage(
    @Param('messageId') messageId: string,
    @Req() req: Request,
    @Body() body: UpdateMessageData,
  ) {
    try {
      const user = req.user as IUserCreated;
      return await this.messageService.update(user, messageId, body);
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  @Delete('/:messageId')
  async deleteMessage(
    @Param('messageId') messageId: string,
    @Req() req: Request,
    @Body() body: DelelteMessageData,
  ) {
    try {
      const user = req.user as IUserCreated;
      return await this.messageService.delete(user, messageId, body);
    } catch (err) {
      console.log(err);
      throw err;
    }
  }
}
