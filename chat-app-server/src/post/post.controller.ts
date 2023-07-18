import {
  Controller,
  Post,
  Req,
  Body,
  Param,
  Delete,
  Patch,
  Get,
  Query,
} from '@nestjs/common';
import { PostService } from './post.service';
import { Request } from 'express';
import { IUserCreated } from '../ultils/interface';
import { DataCreatePost, IDataUpdatePost } from './post.dtop';
import { Ok } from '../ultils/response';

@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post()
  async createPost(@Req() req: Request, @Body() body: DataCreatePost) {
    try {
      const user = req.user as IUserCreated;
      const responseData = await this.postService.createPost(user, body);
      return new Ok(responseData);
    } catch (err) {
      throw err;
    }
  }

  @Get('/:userId')
  async findPostOfUser(
    @Param('userId') userId: string,
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
    @Query('sortBy') sortBy: string = 'ctime',
  ) {
    try {
      const pagination = {
        page: parseInt(page),
        limit: parseInt(limit),
        sortBy,
      };
      const responseData = await this.postService.findPostByUserId(
        userId,
        pagination,
      );
      return new Ok(responseData);
    } catch (err) {
      throw err;
    }
  }

  @Delete('/:postId')
  async deletePost(@Req() req: Request, @Param('postId') postId: string) {
    try {
      const user = req.user as IUserCreated;
      const responseData = await this.postService.deletePost(user, postId);
      return new Ok(responseData);
    } catch (err) {
      throw err;
    }
  }

  @Patch('/:postId')
  async updatePost(
    @Req() req: Request,
    @Param('postId') postId: string,
    @Body() body: IDataUpdatePost,
  ) {
    try {
      const user = req.user as IUserCreated;
      const responseData = await this.postService.updatePost(
        user,
        postId,
        body,
      );
      return new Ok(responseData);
    } catch (err) {
      throw err;
    }
  }
}
