import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { IPost, IUserCreated, Pagination } from '../ultils/interface';
import { DataCreatePost, IDataUpdatePost } from './post.dto';
import { PostRepository } from './post.repository';
import { AuthRepository } from '../auth/repository/auth.repository';
import { RedisService } from '../redis/redis.service';
import { PostType } from '../ultils/constant';

@Injectable()
export class PostService {
  constructor(
    private readonly postReposotpory: PostRepository,
    private readonly userRepository: AuthRepository,
    private readonly redisService: RedisService,
  ) {}

  async findPostByUserId(
    user: IUserCreated,
    postUserId: string,
    pagination: Pagination,
  ) {
    if (!postUserId)
      throw new HttpException('Missing request value!', HttpStatus.NOT_FOUND);
    const foundUser = await this.userRepository.findById(postUserId);
    if (!foundUser)
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    const posts = await this.postReposotpory.findByUserIdV2(
      user,
      postUserId,
      pagination,
    );

    for (let post of posts) {
      if (post.post_type !== PostType.POST) {
        post.post_share = await this.postReposotpory.findById(post.post_share);
      }
    }
    return posts;
  }

  async createPost(
    user: IUserCreated,
    data: DataCreatePost,
    post_image: string,
  ) {
    if (data.post_type === PostType.SHARE && !data.post_share)
      throw new HttpException('Missing request value!', HttpStatus.BAD_REQUEST);

    if (!data.post_content && !post_image && data.post_type === PostType.POST)
      throw new HttpException('Missing request value!', HttpStatus.BAD_REQUEST);

    const newPost = await this.postReposotpory.create(user, data, post_image);
    if (!newPost)
      throw new HttpException('Db error!', HttpStatus.INTERNAL_SERVER_ERROR);

    // Incre share num
    if (data.post_type === PostType.SHARE) {
      const key = `post:${newPost._id.toString()}user:${user._id}`;
      if (this.redisService.get(key)) {
        return newPost;
      } else {
        await this.redisService.set(key, 'shared');
        await this.postReposotpory.increShareNum(data.post_share._id);
      }
    }
    return { ...newPost };
  }

  async deletePost(user: IUserCreated, postId: string) {
    const foundPost = await this.postReposotpory.findById(postId);
    if (!foundPost)
      throw new HttpException('Post not found!', HttpStatus.NOT_FOUND);

    if (user._id !== foundPost.user._id)
      throw new HttpException('User not permission!', HttpStatus.BAD_REQUEST);

    return await this.postReposotpory.delete(user._id, postId);
  }

  async updatePost(user: IUserCreated, postId: string, data: IDataUpdatePost) {
    const foundPost = await this.postReposotpory.findById(postId);
    if (!foundPost)
      throw new HttpException('Post not found!', HttpStatus.NOT_FOUND);

    if (user._id !== foundPost.user._id)
      throw new HttpException('User not permission!', HttpStatus.BAD_REQUEST);

    return await this.postReposotpory.update(user._id, postId, data);
  }

  async likePost(user: IUserCreated, postId: string, quantity: number) {
    if (quantity !== -1 && quantity !== 1)
      throw new HttpException(
        'Quantity increse like not valid!',
        HttpStatus.BAD_REQUEST,
      );

    const foundPost = await this.postReposotpory.findById(postId);

    if (!foundPost)
      throw new HttpException('Post not found!', HttpStatus.NOT_FOUND);
    if (quantity === -1) {
      return await this.postReposotpory.decreLikePost(user, postId, -1);
    } else return await this.postReposotpory.likePost(user, postId, 1);
  }
}
