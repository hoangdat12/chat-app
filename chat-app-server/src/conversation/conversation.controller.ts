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
  Res,
} from '@nestjs/common';
import { ConversationService } from './conversation.service';
import { Request } from 'express';
import { IUserCreated } from '../ultils/interface';
import {
  IDataChangeUsernameOfParticipant,
  ChangeTopic,
  PayloadAddPaticipant,
  PayloadCreateConversation,
  PayloadDeletePaticipant,
  ReadLastMessage,
  RenameGroup,
} from './conversation.dto';
import { validate } from 'class-validator';
import { Ok } from '../ultils/response';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Controller('conversation')
export class ConversationController {
  constructor(
    private readonly conversationService: ConversationService,
    private readonly eventEmiter: EventEmitter2,
  ) {}

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
      return new Ok(
        await this.conversationService.createConversation(user, body),
      );
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  @Get('search')
  async findConversationByName(
    @Req() req: Request,
    @Query('q') keyword: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 20,
    @Query('sortBy') sortBy: string = 'ctime',
  ) {
    try {
      const user = req.user as IUserCreated;
      const pagination = {
        page,
        limit,
        sortBy,
      };
      return new Ok(
        await this.conversationService.findByName(user, keyword, pagination),
      );
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  @Get('/first')
  async getFirstConversation(@Req() req: Request) {
    try {
      const user = req.user as IUserCreated;
      return new Ok(await this.conversationService.getFirstConversation(user));
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  @Get('/:conversationId')
  async getMessageOfConversation(
    @Req() req: Request,
    @Param('conversationId') conversationId: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 50,
    @Query('sortBy') sortBy: string = 'ctime',
  ) {
    try {
      const user = req.user as IUserCreated;
      const pagination = {
        page,
        limit,
        sortBy,
      };
      const response = await this.conversationService.getMessageOfConversation(
        user,
        { conversationId },
        pagination,
      );
      return new Ok(response);
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  @Delete('/:conversationId')
  async deleteConversation(
    @Param('conversationId') conversationId: string,
    @Req() req: Request,
  ) {
    try {
      const user = req.user as IUserCreated;
      return await this.conversationService.deleteConversation(user, {
        conversationId,
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
      const response =
        await this.conversationService.deletePaticipantOfConversation(
          user,
          body,
        );
      return new Ok(response);
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  @Post('/group/participant/add')
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
      const response =
        await this.conversationService.addPaticipantOfConversation(user, body);
      return new Ok(response);
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  @Patch('/change-username')
  async setNicknameOfParticipant(
    @Req() req: Request,
    @Body() body: IDataChangeUsernameOfParticipant,
  ) {
    try {
      const errors = await validate(body);
      if (errors.length > 0) {
        throw new Error('Missing value!');
      }
      const user = req.user as IUserCreated;
      const updated = await this.conversationService.changeUsernameOfUser(
        user,
        body,
      );
      this.eventEmiter.emit('conversation.changeUsername', updated);
      return new Ok(updated.newUsernameOfParticipant);
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
      return new Ok(
        await this.conversationService.changeTopicOfConversation(user, body),
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
      return new Ok(await this.conversationService.renameGroup(user, data));
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  @Post('/read-last-message')
  async readLastMessage(@Req() req: Request, @Body() data: ReadLastMessage) {
    try {
      const errors = await validate(data);
      if (errors.length > 0) {
        throw new Error('Missing value!');
      }
      const user = req.user as IUserCreated;
      return new Ok(
        await this.conversationService.readLastMessage(
          user,
          data.conversationId,
        ),
      );
    } catch (err) {
      console.log(err);
      throw err;
    }
  }
}
