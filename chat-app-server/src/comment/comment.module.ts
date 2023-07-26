import { Module } from '@nestjs/common';
import { CommentService } from './comment.service';
import { MongooseModule } from '@nestjs/mongoose';
import { CommentModel } from '../schema/comment.model';
import { CommentController } from './comment.controller';
import { CommentRepository } from './comment.repository';
import { PostModule } from '../post/post.module';

@Module({
  imports: [MongooseModule.forFeature([CommentModel]), PostModule],
  controllers: [CommentController],
  providers: [CommentService, CommentRepository],
})
export class CommentModule {}
