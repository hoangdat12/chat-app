import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { IParticipant, IUserCreated, Pagination } from 'src/ultils/interface';
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

  async statusFriend(user: IUserCreated, friendId: string) {
    // way 1
    // const status = await this.friendRepository.statusFriend(user, friendId);

    // way 2
    // Check of friend
    const isFriendPromise = this.friendRepository.checkUserIsFriend(
      user,
      friendId,
    );
    const waitConfirmPromise = this.friendRepository.checkUserUnConfirmed(
      user,
      friendId,
    );
    // Check of user
    const userConfirmPromise = this.friendRepository.checkWaitConfirmOfUser(
      user,
      friendId,
    );

    const [isFriend, waitConfirm, confirm] = await Promise.all([
      isFriendPromise,
      waitConfirmPromise,
      userConfirmPromise,
    ]);
    return {
      isFriend: isFriend !== null,
      waitConfirm: waitConfirm !== null,
      confirm: confirm !== null,
      unFriended: isFriend === null && waitConfirm === null && confirm === null,
    };
  }

  async addFriend(user: IUserCreated, friend: IFriend) {
    const existUser = await this.authRepository.findById(friend.userId);
    if (!existUser)
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);

    friend.createdAt = new Date();

    const isFriend = await this.friendRepository.checkUserIsFriend(
      user,
      friend.userId,
    );
    if (isFriend) return;

    // Check user send request add friend to Friend or not
    const waitConfirm = await this.friendRepository.checkUserUnConfirmed(
      user,
      friend.userId,
    );
    // Un Confirm
    if (waitConfirm) {
      return {
        status: 'Add Friend',
        data: await this.friendRepository.cancelRequest(user, friend),
      };
    }

    // Add Friend
    return {
      status: 'Cancel',
      data: await this.friendRepository.addFriend(user, friend),
    };
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
      createdAt: new Date(),
    };
    friend.createdAt = new Date();
    // push into friend
    const confirmeFriendPromiseWithUser = this.friendRepository.confirmFriend(
      userConfirm,
      friend,
    );
    const confirmeFriendPromiseWithFriend = this.friendRepository.confirmFriend(
      friend,
      userConfirm,
    );
    // delete from unconfirmed
    const confirmFriendPromise = this.friendRepository.refuseFriend(
      user,
      friend,
    );

    await Promise.all([
      confirmeFriendPromiseWithUser,
      confirmeFriendPromiseWithFriend,
      confirmFriendPromise,
    ]);

    return friend;
  }

  async refuseFriend(user: IUserCreated, friend: IFriend) {
    const existUser = await this.authRepository.findById(friend.userId);
    if (!existUser)
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);

    const data = await this.friendRepository.refuseFriend(user, friend);
    if (!data)
      throw new HttpException(
        'Server Error!',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );

    return friend;
  }

  async findFriend(
    user: IUserCreated,
    keyword: string,
    pagination: Pagination,
  ) {
    return {
      friends: await this.friendRepository.findByName(
        user._id,
        keyword,
        pagination,
      ),
      keyword,
    };
  }

  async getFriendAndUnConfirmedOfUser(
    user: IUserCreated,
    pagination: Pagination,
  ) {
    const { totalNotify } = await this.getNotifyAddFriend(user);
    const data = await this.friendRepository.findByUserId(user._id, pagination);
    return { ...data, totalNotify };
  }

  async getListFriend(user: IUserCreated, pagination: Pagination) {
    return await this.friendRepository.findFriendByUserId(user._id, pagination);
  }

  async getNotifyAddFriend(user: IUserCreated) {
    const numberNotify = 6;
    const waiters = await this.friendRepository.getNotifyAddFriend(
      user,
      numberNotify,
    );
    let totalNotify = 0;
    for (let waiter of waiters) {
      if (!waiter.unconfirmed.isWatched) {
        totalNotify++;
      } else break;
    }
    return { totalNotify };
  }

  async getListUnConfirmed(user: IUserCreated, pagination: Pagination) {
    return await this.friendRepository.findUnconfirmedByUserId(
      user._id,
      pagination,
    );
  }
}
