import { Body, Controller, Post, Req } from '@nestjs/common';
import { ConversationService } from './conversation.service';
import { Request } from 'express';
import { IUserCreated } from 'src/auth/repository/auth.repository';
import { IPayloadCreateConversation } from './conversation.base';

@Controller('conversation')
export class ConversationController {
  constructor(private readonly conversationService: ConversationService) {}

  @Post()
  async createConversation(
    @Req() req: Request,
    @Body() body: IPayloadCreateConversation,
  ) {
    try {
      const user = req.user as IUserCreated;
      return await this.conversationService.createConversation(user, body);
    } catch (err) {
      console.log(err);
      throw err;
    }
  }
}
