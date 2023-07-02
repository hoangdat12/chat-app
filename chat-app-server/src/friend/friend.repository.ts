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
    return this.friendModel
      .find({
        user: userId,
        'friends.userName': { $regex: { searchRegex } },
      })
      .sort({ 'friend.userName': 1 })
      .skip(offset)
      .limit(limit)
      .lean()
      .exec();
  }

  async findByUserId(userId: string, pagination: Pagination) {
    const { limit, page } = checkNegativeNumber(pagination);
    const offset = (page - 1) * limit;
    return this.friendModel
      .find({
        user: userId,
      })
      .sort({ 'friend.userName': 1 })
      .skip(offset)
      .limit(limit)
      .lean()
      .exec();
  }

  async addFriend(user: IUserCreated, friend: IFriend) {
    const userAddFriend = {
      userId: user._id,
      email: user.email,
      userName: getUsername(user),
      avatarUrl: user.avatarUrl,
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

  async confirmFriend(user: IUserCreated, friend: IFriend) {
    return await this.friendModel.findOneAndUpdate(
      {
        user: user._id,
        'unconfirmed.userId': friend.userId,
      },
      {
        $push: {
          friends: friend,
        },
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

  async addFriendSuccess(user: IFriend, friend: IFriend) {
    return await this.friendModel.findOneAndUpdate(
      {
        user: friend.userId,
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
        'friends.userId': friend.userId,
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
}
