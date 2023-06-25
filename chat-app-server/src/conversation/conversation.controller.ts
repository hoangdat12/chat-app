import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
} from '@nestjs/common';
import { ConversationService } from './conversation.service';
import { Request } from 'express';
import { IUserCreated } from '../ultils/interface';
import {
  ChangeNickNameOfParticipant,
  ChangeTopic,
  PayloadAddPaticipant,
  PayloadCreateConversation,
  PayloadDeletePaticipant,
  RenameGroup,
} from './conversation.dto';
import { validate } from 'class-validator';

@Controller('conversation')
export class ConversationController {
  constructor(private readonly conversationService: ConversationService) {}

  @Post()
  async createConversation(
    @Req() req: Request,
    @Body() body: PayloadCreateConversation,
  ) {
    try {
      const errors = await validate(body);
      if (errors.length > 0) {
        throw new Error('Missing value!');
      }
      const user = req.user as IUserCreated;
      return await this.conversationService.createConversation(user, body);
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  @Get('/:conversationType/:conversationId')
  async getMessageOfConversation(
    @Req() req: Request,
    @Param('conversationId') conversationId: string,
    @Param('conversationType') conversationType: string,
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('sortBy') sortBy: string,
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

  @Delete('/:conversationId')
  async deleteConversation(
    @Param('conversationId') conversationId: string,
    @Req() req: Request,
    @Body('conversationType') conversationType: string,
  ) {
    try {
      const user = req.user as IUserCreated;
      return await this.conversationService.deleteConversation(user, {
        conversationId,
        conversationType,
      });
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  @Patch('/group/participant/delele')
  async deletePaticipantOfConversation(
    @Req() req: Request,
    @Body() body: PayloadDeletePaticipant,
  ) {
    try {
      const errors = await validate(body);
      if (errors.length > 0) {
        throw new Error('Missing value!');
      }
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

  @Patch('/group/participant/add')
  async addPaticipantOfConversation(
    @Req() req: Request,
    @Body() body: PayloadAddPaticipant,
  ) {
    try {
      const errors = await validate(body);
      if (errors.length > 0) {
        throw new Error('Missing value!');
      }
      const user = req.user as IUserCreated;
      return await this.conversationService.addPaticipantOfConversation(
        user,
        body,
      );
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  @Patch('/change-username')
  async setNicknameOfParticipant(
    @Req() req: Request,
    @Body() body: ChangeNickNameOfParticipant,
  ) {
    try {
      const errors = await validate(body);
      if (errors.length > 0) {
        throw new Error('Missing value!');
      }
      const user = req.user as IUserCreated;
      return await this.conversationService.setNickNameForParticipant(
        user,
        body,
      );
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  @Patch('/change-topic')
  async changeTopicOfConversation(
    @Req() req: Request,
    @Body() body: ChangeTopic,
  ) {
    try {
      const errors = await validate(body);
      if (errors.length > 0) {
        throw new Error('Missing value!');
      }
      const user = req.user as IUserCreated;
      return await this.conversationService.changeTopicOfConversation(
        user,
        body,
      );
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  @Patch('/change-name-group')
  async renameGroup(@Req() req: Request, @Body() data: RenameGroup) {
    try {
      const errors = await validate(data);
      if (errors.length > 0) {
        throw new Error('Missing value!');
      }
      const user = req.user as IUserCreated;
      return await this.conversationService.renameGroup(user, data);
    } catch (err) {
      console.log(err);
      throw err;
    }
  }
}
