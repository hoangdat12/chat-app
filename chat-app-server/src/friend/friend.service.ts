import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { IParticipant, IUserCreated, Pagination } from 'src/ultils/interface';
import { IFriend } from '../ultils/interface/friend.interface';
import { AuthRepository } from '../auth/repository/auth.repository';
import { FriendRepository } from './friend.repository';
import { getUsername } from '../ultils';
import { NotifyService } from '../notify/notify.service';
import { NotifyType } from '../ultils/constant/notify.constant';
import { RedisService } from '../redis/redis.service';
import { ProfileRepository } from '../profile/repository/profile.repository';

@Injectable()
export class FriendService {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly friendRepository: FriendRepository,
    private readonly notifyService: NotifyService,
    private readonly redisService: RedisService,
    private readonly profileRepository: ProfileRepository,
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

  // The action of the user who make add friends
  async addFriend(user: IUserCreated, friend: IFriend) {
    // Check user add friend exist
    const existUser = await this.authRepository.findById(friend.userId);
    if (!existUser)
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);

    // Check have friend or not
    const isFriend = await this.friendRepository.checkUserIsFriend(
      user,
      friend.userId,
    );
    if (isFriend) return;

    // Check have unconfirmed or not
    const waitConfirm = await this.friendRepository.checkUserUnConfirmed(
      user,
      friend.userId,
    );
    // Un Confirm
    if (waitConfirm) {
      // Delete Notify
      const notify = await this.notifyService.deleteNotifyAddFriend(
        friend.userId,
        user._id,
      );

      return {
        status: 'Add Friend',
        data: await this.friendRepository.cancelRequest(user, friend),
        notify,
      };
    }

    // Create notify
    const userNotify = {
      userId: user._id,
      userName: getUsername(user),
      avatarUrl: user.avatarUrl,
    };
    const data = {
      notifyType: NotifyType.ADD_FRIEND,
      ownerNotify: { userId: friend.userId },
      notify_friend: {
        ...userNotify,
        email: user.email,
      },
      notifyLink: null,
      post: null,
    };
    const notify = await this.notifyService.createNotify(userNotify, data);
    if (!notify)
      throw new HttpException(
        'Server Error!',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    // Add Friend
    return {
      status: 'Cancel',
      data: await this.friendRepository.addFriend(user, friend),
      notify,
    };
  }

  // The action of user received request add friend
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

    // Delete Notify
    this.notifyService.deleteNotifyAddFriend(user._id, friend.userId);

    // Update quantity Friend
    this.profileRepository.increQuantityFriend(user._id, 1);

    await Promise.all([
      confirmeFriendPromiseWithUser,
      confirmeFriendPromiseWithFriend,
      confirmFriendPromise,
    ]);

    return friend;
  }

  // The action of user received request add friend
  // Refuse request add friend
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

    // Delete Notify
    await this.notifyService.deleteNotifyAddFriend(user._id, friend.userId);

    return friend;
  }

  // Delete friend
  async deleteFriend(user: IUserCreated, friendId: string) {
    const isValidFriend = await this.friendRepository.checkUserIsFriend(
      user,
      friendId,
    );

    if (!isValidFriend) return;

    // Update quantity Friend
    this.profileRepository.increQuantityFriend(user._id, -1);
    this.profileRepository.increQuantityFriend(friendId, -1);

    this.friendRepository.deleteFriend(friendId, user._id);
    return await this.friendRepository.deleteFriend(user._id, friendId);
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

  // console.log(await this.friendRepository.findAllFriendOfUser(userId));
  // [
  //   {
  //     friends: [
  //       '644d4fee5fbc1a71278fe6c0',
  //       '644944193bcfbedbdea05a98',
  //       '644943ee3bcfbedbdea05a8c'
  //     ]
  //   }
  // ]
  async getListFriend(
    user: IUserCreated,
    userId: string,
    pagination: Pagination,
  ) {
    const responseData = {
      friends: [],
      mutualFriends: null,
    };
    // If user'profile or list friend equal 0 then return
    if (user._id === userId) {
      responseData.friends = await this.friendRepository.findByUserId(
        userId,
        pagination,
      );
      return responseData;
    }

    // If view profile

    // Key of user's friend
    const key1 = `friend:${userId}`;
    // Check mutual friend
    if (!(await this.redisService.has(key1))) {
      // Not has key
      const friends = await this.friendRepository.findAllFriendOfUser(userId);
      if (friends.length === 0) return responseData;
      await this.redisService.sAdd(key1, friends[0].friends, 600);
    } else {
      // user make the request
      const key2 = `friend:${user._id}`;
      // Not key
      if (!(await this.redisService.has(key2))) {
        const myFriends = await this.friendRepository.findAllFriendOfUser(
          user._id,
        );
        if (!myFriends || myFriends[0].friends.length === 0)
          return responseData;

        await this.redisService.sAdd(key2, myFriends[0].friends);
      }

      // Get mutual Friend
      const mutualFriendsId = await this.redisService.sInter(key1, key2);

      responseData.friends = await this.friendRepository.findMutualFriends(
        user,
        userId,
        mutualFriendsId,
        pagination,
      );
      responseData.mutualFriends = mutualFriendsId.length;
    }
    return responseData;
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

  async getAllFriendOfUser(user: IUserCreated, userId: string) {
    if (user._id === userId)
      return {
        friends: await this.friendRepository.findAllFriendOfUser(userId),
        mutualFriends: null,
      };
    const key1 = `friend:${userId}`;
    const key2 = `friend:${user._id}`;
    // Check mutual friend
    if (!(await this.redisService.has(key1))) {
      // Not has key
      const friends = await this.friendRepository.findAllFriendOfUser(userId);
      await this.redisService.sAdd(key1, friends[0].friends, 600);
    }
    // user make the request
    // Not key
    if (!(await this.redisService.has(key2))) {
      const myFriends = await this.friendRepository.findAllFriendOfUser(
        user._id,
      );
      await this.redisService.sAdd(key2, myFriends[0].friends);
    }

    const mutualFriendsId = await this.redisService.sInter(key1, key2);
    const mutualFriendsPromise =
      this.friendRepository.findMutualFriendsByFriendIds(
        userId,
        mutualFriendsId,
      );
    const friendsPromise = this.friendRepository.findFriendsNotInMutualFriendId(
      userId,
      mutualFriendsId,
    );
    const [mutualFriends, friends] = await Promise.all([
      mutualFriendsPromise,
      friendsPromise,
    ]);

    return {
      mutualFriends,
      friends,
    };
  }
}
