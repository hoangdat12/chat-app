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
  UploadedFile,
  UseInterceptors,
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
  ChangeEmoji,
} from './conversation.dto';
import { validate } from 'class-validator';
import { Ok } from '../ultils/response';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerOptions } from '../ultils/constant/multer.config';

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
      throw err;
    }
  }

  @Get('/first')
  async getFirstConversation(@Req() req: Request) {
    try {
      const user = req.user as IUserCreated;
      return new Ok(await this.conversationService.getFirstConversation(user));
    } catch (err) {
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
      const responseData =
        await this.conversationService.deletePaticipantOfConversation(
          user,
          body,
        );
      this.eventEmiter.emit('conversaiton.participant.delete', responseData);
      return new Ok('Delete user from group successfully!');
    } catch (err) {
      throw err;
    }
  }

  @Patch('/group/participant/promoted')
  async promotedAminGroup(
    @Req() req: Request,
    @Body() body: PayloadDeletePaticipant,
  ) {
    try {
      const errors = await validate(body);
      if (errors.length > 0) {
        throw new Error('Missing value!');
      }
      const user = req.user as IUserCreated;
      const responseData = await this.conversationService.promotedAminGroup(
        user,
        body,
      );
      return new Ok(responseData);
    } catch (err) {
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
      throw err;
    }
  }

  @Patch('/change-name-group')
  async renameGroup(@Req() req: Request, @Body() data: RenameGroup) {
    try {
      console.log(data);
      const errors = await validate(data);
      if (errors.length > 0) {
        throw new Error('Missing value!');
      }
      const user = req.user as IUserCreated;
      const responseData = await this.conversationService.renameGroup(
        user,
        data,
      );
      this.eventEmiter.emit('conversation.changeNameGroup', responseData);
      return new Ok(responseData);
    } catch (err) {
      throw err;
    }
  }

  @Patch('/change-avatar-group')
  @UseInterceptors(FileInterceptor('file', multerOptions))
  async changeAvatarGroup(
    @Req() req: Request,
    @Body('conversationId') conversationId: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    try {
      const user = req.user as IUserCreated;
      const responseData = await this.conversationService.changeAvatarGroup(
        user,
        conversationId,
        file,
      );
      this.eventEmiter.emit('conversation.changeAvatarGroup', {
        user,
        conversation: responseData,
      });
      return new Ok(responseData);
    } catch (err) {
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
      throw err;
    }
  }

  @Patch('/change-emoji')
  async changeEmoji(@Req() req: Request, @Body() data: ChangeEmoji) {
    try {
      const errors = await validate(data);
      if (errors.length > 0) {
        throw new Error('Missing value!');
      }
      const user = req.user as IUserCreated;
      const responseData = await this.conversationService.changeEmoji(
        user,
        data,
      );
      this.eventEmiter.emit('conversation.changeEmoji', {
        user,
        conversation: responseData,
      });
      return new Ok(responseData);
    } catch (err) {
      throw err;
    }
  }
}
