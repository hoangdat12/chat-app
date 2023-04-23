import { Body, Controller, Post, Req } from '@nestjs/common';
import { CreateMessageData } from './message.dto';
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
}
