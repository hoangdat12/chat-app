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
          $unwind: '$friends',
        },
        {
          $project: {
            _id: 0,
            userId: '$friends.userId',
            email: '$friends.email',
            userName: '$friends.userName',
            avatarUrl: '$friends.avatarUrl',
          },
        },
        {
          $addFields: {
            isFriend: true,
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

  async findAllFriendOfUser(userId: string) {
    return this.friendModel.aggregate([
      { $match: { user: userId } },
      {
        $unwind: '$friends',
      },
      {
        $project: {
          _id: 0,
          userId: '$friends.userId',
          email: '$friends.email',
          userName: '$friends.userName',
          avatarUrl: '$friends.avatarUrl',
        },
      },
    ]);
  }

  // Find friends with mutual friends at the beginning and the rest at the end
  async findMutualFriends(
    user: IUserCreated,
    userId: string,
    friendIds: string[],
    pagination: Pagination,
  ) {
    const { limit } = checkNegativeNumber(pagination);
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
            isMatched: {
              $cond: {
                if: {
                  $and: [
                    { $in: ['$friends.userId', friendIds] },
                    { $ne: ['$friends.userId', user._id] },
                  ],
                },
                then: true,
                else: false,
              },
            },
          },
        },
        {
          $group: {
            _id: null,
            matchedFriends: {
              $push: {
                $cond: [
                  { $eq: ['$isMatched', true] }, // Check if isMatched is true
                  {
                    $mergeObjects: [
                      '$friends',
                      { isFriend: true }, // Add the isFriend field for unmatched friends
                    ],
                  },
                  '$$REMOVE',
                ],
              },
            },
            unmatchedFriends: {
              $push: {
                $cond: [
                  { $eq: ['$isMatched', false] }, // Check if isMatched is false
                  {
                    $mergeObjects: [
                      '$friends',
                      { isFriend: false }, // Add the isFriend field for unmatched friends
                    ],
                  },
                  '$$REMOVE',
                ],
              },
            },
          },
        },
        {
          $project: {
            combinedFriends: {
              $setUnion: ['$matchedFriends', '$unmatchedFriends'],
            },
          },
        },
        {
          $unwind: '$combinedFriends',
        },
        {
          $replaceRoot: {
            newRoot: '$combinedFriends',
          },
        },
        {
          $limit: limit,
        },
      ])
      .exec();
  }

  async findMutualFriendsByFriendIds(userId: string, friendIds: string[]) {
    return await this.friendModel
      .aggregate([
        {
          $match: { user: userId }, // Match friends with specified friendIds
        },
        {
          $unwind: '$friends',
        },
        {
          $match: { 'friends.userId': { $in: friendIds } }, // Filter again after unwinding
        },
        {
          $project: {
            _id: 0,
            userId: '$friends.userId',
            email: '$friends.email',
            userName: '$friends.userName',
            avatarUrl: '$friends.avatarUrl',
          },
        },
      ])
      .exec();
  }

  async findFriendsNotInMutualFriendId(userId: string, friendIds: string[]) {
    return await this.friendModel
      .aggregate([
        {
          $match: { user: userId }, // Match friends with specified friendIds
        },
        {
          $unwind: '$friends',
        },
        {
          $match: { 'friends.userId': { $nin: friendIds } }, // Filter again after unwinding
        },
        {
          $project: {
            _id: 0,
            userId: '$friends.userId',
            email: '$friends.email',
            userName: '$friends.userName',
            avatarUrl: '$friends.avatarUrl',
          },
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
      user: user._id,
      'friends.userId': friendId,
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

  async findFriendNotInGroup(
    user: IUserCreated,
    keyword: string,
    conversationId: string,
  ) {
    const searchRegex = new RegExp(keyword, 'i');

    return await this.friendModel.aggregate([
      {
        $match: { user: user._id },
      },
      {
        $lookup: {
          from: 'Conversation',
          localField: 'friends.userId',
          foreignField: 'participants.userId',
          as: 'matchedConversations',
        },
      },
      {
        $addFields: {
          matchedConversations: {
            $filter: {
              input: '$matchedConversations',
              as: 'conversation',
              cond: { $eq: ['$$conversation._id', conversationId] },
            },
          },
        },
      },
      {
        $match: {
          matchedConversations: { $size: 0 },
          'friends.userName': { $regex: searchRegex },
        },
      },
      {
        $project: { _id: 0, friends: 1 },
      },
    ]);
  }

  async deleteFriend(userId: string, friendId: string) {
    return await this.friendModel.findOneAndUpdate(
      {
        user: userId,
        'friends.userId': friendId,
      },
      {
        $pull: {
          friends: {
            userId: friendId,
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
