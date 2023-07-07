import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Friend } from '../schema/friend.model';
import { Model } from 'mongoose';
import { IUserCreated, Pagination } from '../ultils/interface';
import { IFriend } from 'src/ultils/interface/friend.interface';
import { checkNegativeNumber, getUsername } from '../ultils';

@Injectable()
export class FriendRepository {
  constructor(
    @InjectModel(Friend.name)
    private readonly friendModel: Model<Friend>,
  ) {}

  async create(user: IUserCreated) {
    return await this.friendModel.create({ user: user._id });
  }

  async findByName(userId: string, friendName: string, pagination: Pagination) {
    const { limit, page } = checkNegativeNumber(pagination);
    const offset = (page - 1) * limit;
    const searchRegex = new RegExp(friendName, 'i');
    return await this.friendModel.aggregate([
      {
        $match: {
          user: userId,
          'friends.userName': { $regex: searchRegex },
        },
      },
      {
        $unwind: '$friends',
      },
      {
        $project: {
          _id: 0,
          friends: 1,
        },
      },
      {
        $sort: {
          'friends.createdAt': -1,
        },
      },
      {
        $skip: offset,
      },
      {
        $limit: limit,
      },
    ]);
  }

  async findByUserId(userId: string, pagination: Pagination) {
    const { limit, page } = checkNegativeNumber(pagination);
    const offset = (page - 1) * limit;
    return this.friendModel
      .aggregate([
        {
          $match: {
            user: userId,
          },
        },
        {
          $unwind: '$unconfirmed',
        },
        {
          $project: {
            _id: 0,
            unconfirmed: 1,
          },
        },
        {
          $sort: {
            'friends.createdAt': -1,
            'unconfirmed.createdAt': -1,
          },
        },
        {
          $skip: offset,
        },
        {
          $limit: limit,
        },
      ])
      .exec();
  }

  async findFriendByUserId(userId: string, pagination: Pagination) {
    const { limit, page } = checkNegativeNumber(pagination);
    const offset = (page - 1) * limit;
    return this.friendModel
      .aggregate([
        {
          $match: {
            user: userId,
          },
        },
        {
          $unwind: '$friends',
        },
        {
          $project: {
            _id: 0,
            friends: 1,
          },
        },
        {
          $sort: {
            'friends.createdAt': -1,
          },
        },
        {
          $skip: offset,
        },
        {
          $limit: limit,
        },
      ])
      .exec();
  }

  async findUnconfirmedByUserId(userId: string, pagination: Pagination) {
    const { limit, page } = checkNegativeNumber(pagination);
    const offset = (page - 1) * limit;
    return this.friendModel
      .aggregate([
        {
          $match: {
            user: userId,
          },
        },
        {
          $unwind: '$unconfirmed',
        },
        {
          $project: {
            _id: 0,
            unconfirmed: 1,
          },
        },
        {
          $sort: {
            'unconfirmed.createdAt': -1,
          },
        },
        {
          $skip: offset,
        },
        {
          $limit: limit,
        },
      ])
      .exec();
  }

  async addFriend(user: IUserCreated, friend: IFriend) {
    const userAddFriend = {
      userId: user._id,
      email: user.email,
      userName: getUsername(user),
      avatarUrl: user.avatarUrl,
      createdAt: new Date(),
      isWatched: false,
    };
    return await this.friendModel.findOneAndUpdate(
      {
        user: friend.userId,
      },
      {
        $push: { unconfirmed: userAddFriend },
      },
      {
        new: true,
        upsert: true,
      },
    );
  }

  async cancelRequest(user: IUserCreated, friend: IFriend) {
    return await this.friendModel.findOneAndUpdate(
      {
        user: friend.userId,
      },
      {
        $pull: { unconfirmed: { userId: user._id } },
      },
      {
        new: true,
        upsert: true,
      },
    );
  }

  async confirmFriend(user: IFriend, friend: IFriend) {
    return await this.friendModel.findOneAndUpdate(
      {
        user: friend.userId,
        'friends.userId': { $ne: user.userId },
      },
      {
        $push: {
          friends: user,
        },
      },
      {
        new: true,
        upsert: true,
      },
    );
  }

  async refuseFriend(user: IUserCreated, friend: IFriend) {
    return await this.friendModel.findOneAndUpdate(
      {
        user: user._id,
        'unconfirmed.userId': friend.userId,
      },
      {
        $pull: {
          unconfirmed: {
            userId: friend.userId,
          },
        },
      },
      {
        new: true,
        upsert: true,
      },
    );
  }

  async statusFriend(user: IUserCreated, friendId: string) {
    return await this.friendModel.aggregate([
      {
        $match: {
          user: friendId,
        },
      },
      {
        $project: {
          containsUserIdInFriends: {
            $in: [user._id, '$friends.user'],
          },
          containsUserIdInUnconfirmed: {
            $in: [user._id, '$unconfirmed.userId'],
          },
        },
      },
    ]);
  }

  async checkUserUnConfirmed(user: IUserCreated, friendId: string) {
    return await this.friendModel.findOne({
      user: friendId,
      'unconfirmed.userId': user._id,
    });
  }

  async checkUserIsFriend(user: IUserCreated, friendId: string) {
    return await this.friendModel.findOne({
      user: friendId,
      'friends.userId': user._id,
    });
  }

  async checkWaitConfirmOfUser(user: IUserCreated, friendId: string) {
    return await this.friendModel.findOne({
      user: user._id,
      'unconfirmed.userId': friendId,
    });
  }

  async getNotifyAddFriend(user: IUserCreated, numberNotify: number = 6) {
    return await this.friendModel.aggregate([
      { $match: { user: user._id } },
      { $unwind: '$unconfirmed' },
      { $project: { _id: 0, 'unconfirmed.isWatched': 1 } },
      { $sort: { 'unconfirmed.createdAt': -1 } },
      { $limit: numberNotify },
    ]);
  }
}
