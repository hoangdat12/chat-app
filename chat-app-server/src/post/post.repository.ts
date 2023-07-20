import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Post } from '../schema/post.model';
import { IUserCreated, Pagination } from '../ultils/interface';
import { DataCreatePost, IDataUpdatePost } from './post.dto';
import { PostMode, PostType } from '../ultils/constant';
import { objectNotContainNull } from '../ultils';

@Injectable()
export class PostRepository {
  constructor(
    @InjectModel(Post.name)
    private readonly postModel: Model<Post>,
  ) {}

  async findById(postId: string) {
    return await this.postModel.findById({ _id: postId }).lean();
  }

  async findByUserId(userId: string, pagiantion: Pagination) {
    const { limit, page, sortBy } = pagiantion;
    const offset = (page - 1) * limit;
    return await this.postModel
      .find({
        user: userId,
      })
      .sort(sortBy === 'ctime' ? { createdAt: -1 } : { createdAt: 1 })
      .skip(offset)
      .limit(limit)
      .lean()
      .exec();
  }

  async create(user: IUserCreated, data: DataCreatePost, post_image: string) {
    const {
      post_content,
      post_mode = PostMode.PUBLIC,
      post_type = PostType.POST,
    } = data;
    return await this.postModel.create({
      user: user._id,
      post_content,
      post_image,
      post_type,
      post_mode,
    });
  }

  async delete(userId: string, postId: string) {
    return await this.postModel.deleteOne({ user: userId, _id: postId });
  }

  async update(userId: string, postId: string, data: IDataUpdatePost) {
    const objUpdate = objectNotContainNull(data);
    return await this.postModel.updateOne(
      {
        _id: postId,
        user: userId,
      },
      objUpdate,
      { new: true, upsert: true },
    );
  }
}
