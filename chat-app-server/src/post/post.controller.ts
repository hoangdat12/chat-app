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
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { PostService } from './post.service';
import { Request } from 'express';
import { IUserCreated } from '../ultils/interface';
import { DataCreatePost, IDataUpdatePost } from './post.dto';
import { Ok } from '../ultils/response';
import { FileInterceptor } from '@nestjs/platform-express/multer';
import { multerOptions } from '../ultils/constant';

@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file', multerOptions))
  async createPost(
    @Req() req: Request,
    @Body('data') data: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    try {
      const body = JSON.parse(data) as DataCreatePost;
      const post_image = file
        ? `http://localhost:8080/assets/${file.filename}`
        : null;
      const user = req.user as IUserCreated;
      const responseData = await this.postService.createPost(
        user,
        body,
        post_image,
      );
      return new Ok(responseData);
    } catch (err) {
      throw err;
    }
  }

  @Get('/:userId')
  async findPostOfUser(
    @Req() req: Request,
    @Param('userId') userId: string,
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
    @Query('sortBy') sortBy: string = 'ctime',
  ) {
    try {
      const user = req.user as IUserCreated;
      const pagination = {
        page: parseInt(page),
        limit: parseInt(limit),
        sortBy,
      };
      const responseData = await this.postService.findPostByUserId(
        user,
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

  @Post('/like/:postId')
  async likePost(
    @Req() req: Request,
    @Param('postId') postId: string,
    @Body('quantity') quantity: number,
  ) {
    try {
      const user = req.user as IUserCreated;
      const responseData = await this.postService.likePost(
        user,
        postId,
        quantity,
      );
      return new Ok(responseData);
    } catch (err) {
      throw err;
    }
  }
}
