import { Body, Controller, Get, Param, Post, Query, Req } from '@nestjs/common';
import { CommentService } from './comment.service';
import { Request } from 'express';
import { DataCreateComment } from './comment.dto';
import { IUserCreated } from '../ultils/interface';
import { validate } from 'class-validator';
import { Created, Ok } from '../ultils/response';

@Controller('/comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post()
  async createComment(@Req() req: Request, @Body() body: DataCreateComment) {
    try {
      const errors = await validate(body);
      if (errors.length > 0) {
        throw new Error('Missing value!');
      }
      const user = req.user as IUserCreated;
      return new Created(await this.commentService.createComment(user, body));
    } catch (err) {
      throw err;
    }
  }

  @Get('/:postId')
  async getListComment(
    @Param('postId') postId: string,
    @Query('parentCommentId') parentCommentId: string,
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
      return new Ok(
        await this.commentService.getListCommentOfPost(
          postId,
          parentCommentId,
          pagination,
        ),
      );
    } catch (err) {
      throw err;
    }
  }
}
