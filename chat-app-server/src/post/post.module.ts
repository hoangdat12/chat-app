import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PostModel } from '../schema/post.model';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { PostRepository } from './post.repository';

@Module({
  imports: [MongooseModule.forFeature([PostModel])],
  providers: [PostService, PostRepository],
  controllers: [PostController],
})
export class PostModule {}
