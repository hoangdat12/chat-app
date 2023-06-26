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
import { Request } from 'express';
import { Ok } from 'src/ultils/response';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { IUserCreated } from '../ultils/interface';
import { validate } from 'class-validator';

@Controller('message')
export class MessageController {
  constructor(
    private readonly messageService: MessageService,
    private readonly evenEmiter: EventEmitter2,
  ) {}
  @Post()
  async createMessage(@Req() req: Request, @Body() body: CreateMessageData) {
    try {
      const errors = await validate(body);
      if (errors.length > 0) {
        throw new Error('Missing value!');
      }
      const user = req.user as IUserCreated;
      const newMessage = await this.messageService.createMessage(user, body);
      this.evenEmiter.emit('message.create', newMessage);
      return new Ok<any>(newMessage);
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  @Patch()
  async updateMessage(@Req() req: Request, @Body() body: UpdateMessageData) {
    try {
      const errors = await validate(body);
      if (errors.length > 0) {
        throw new Error('Missing value!');
      }
      const user = req.user as IUserCreated;
      return await this.messageService.update(user, body);
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  @Delete()
  async deleteMessage(@Req() req: Request, @Body() body: DelelteMessageData) {
    try {
      console.log(body);
      const errors = await validate(body);
      if (errors.length > 0) {
        throw new Error('Missing value!');
      }
      const user = req.user as IUserCreated;
      return await this.messageService.delete(user, body);
    } catch (err) {
      console.log(err);
      throw err;
    }
  }
}
