import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PostModel } from '../schema/post.model';

@Module({
  imports: [MongooseModule.forFeature([PostModel])],
  providers: [],
  controllers: [],
})
export class PostModule {}
