import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { IUserCreated, Pagination } from '../ultils/interface';
import { DataCreatePost, IDataUpdatePost } from './post.dtop';
import { PostRepository } from './post.repository';
import { AuthRepository } from '../auth/repository/auth.repository';

@Injectable()
export class PostService {
  constructor(
    private readonly postReposotpory: PostRepository,
    private readonly userRepository: AuthRepository,
  ) {}

  async findPostByUserId(userId: string, pagination: Pagination) {
    if (!userId)
      throw new HttpException('Missing request value!', HttpStatus.NOT_FOUND);
    const foundUser = await this.userRepository.findById(userId);
    if (!foundUser)
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    return await this.postReposotpory.findByUserId(userId, pagination);
  }

  async createPost(user: IUserCreated, data: DataCreatePost) {
    if (!data.post_content && !data.post_image)
      throw new HttpException('Missing request value!', HttpStatus.BAD_REQUEST);
    return await this.postReposotpory.create(user, data);
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
}
