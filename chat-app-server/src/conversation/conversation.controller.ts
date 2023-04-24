import {
  Body,
  Controller,
  Param,
  Patch,
  Post,
  Query,
  Req,
} from '@nestjs/common';
import { ConversationService } from './conversation.service';
import { Request } from 'express';
import { IUserCreated } from 'src/auth/repository/auth.repository';
import {
  PayloadCreateConversation,
  PayloadDeletePaticipant,
} from './conversation.dto';

@Controller('conversation')
export class ConversationController {
  constructor(private readonly conversationService: ConversationService) {}

  @Post()
  async createConversation(
    @Req() req: Request,
    @Body() body: PayloadCreateConversation,
  ) {
    try {
      const user = req.user as IUserCreated;
      return await this.conversationService.createConversation(user, body);
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  @Post('/:conversationId')
  async getMessageOfConversation(
    @Param('conversationId') conversationId: string,
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('sortBy') sortBy: string,
    @Req() req: Request,
    @Body('conversationType') conversationType: string,
  ) {
    try {
      const user = req.user as IUserCreated;
      const pagination = {
        page: page || 1,
        limit: limit || 50,
        sortBy: sortBy || 'ctime',
      };
      return await this.conversationService.getMessageOfConversation(
        user,
        {
          conversationType,
          conversationId,
        },
        pagination,
      );
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  @Patch('/group/paticipant')
  async deletePaticipantOfConversation(
    @Req() req: Request,
    @Body() body: PayloadDeletePaticipant,
  ) {
    try {
      const user = req.user as IUserCreated;
      return await this.conversationService.deletePaticipantOfConversation(
        user,
        body,
      );
    } catch (err) {
      console.log(err);
      throw err;
    }
  }
}
