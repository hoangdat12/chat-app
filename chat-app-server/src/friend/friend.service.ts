import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { IUserCreated, Pagination } from 'src/ultils/interface';
import { IFriend } from '../ultils/interface/friend.interface';
import { AuthRepository } from '../auth/repository/auth.repository';
import { FriendRepository } from './friend.repository';
import { getUsername } from '../ultils';

@Injectable()
export class FriendService {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly friendRepository: FriendRepository,
  ) {}
  async create(user: IUserCreated) {
    return await this.friendRepository.create(user);
  }

  async addFriend(user: IUserCreated, friend: IFriend) {
    const existUser = await this.authRepository.findById(friend.userId);
    if (!existUser)
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);

    return await this.friendRepository.addFriend(user, friend);
  }

  async confirmFriend(user: IUserCreated, friend: IFriend) {
    const existUser = await this.authRepository.findById(friend.userId);
    if (!existUser)
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);

    const userConfirm = {
      userId: user._id,
      email: user.email,
      userName: getUsername(user),
      avatarUrl: user.avatarUrl,
    };
    const addFriendSuccessPromise = this.friendRepository.addFriendSuccess(
      userConfirm,
      friend,
    );
    const confirmFriendPromise = this.friendRepository.confirmFriend(
      user,
      friend,
    );

    await Promise.all([addFriendSuccessPromise, confirmFriendPromise]);

    return 'Successfully';
  }

  async refuseFriend(user: IUserCreated, friend: IFriend) {
    const existUser = await this.authRepository.findById(friend.userId);
    if (!existUser)
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);

    return await this.friendRepository.refuseFriend(user, friend);
  }

  async findFriend(
    user: IUserCreated,
    keyword: string,
    pagination: Pagination,
  ) {
    return await this.friendRepository.findByName(
      user._id,
      keyword,
      pagination,
    );
  }

  async getListFriend(user: IUserCreated, pagination: Pagination) {
    return await this.friendRepository.findByUserId(user._id, pagination);
  }
}
