import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { User } from '../../schema/user.model';
import { ChangeUsername, UserRegister } from '../auth.dto';
import { IUserCreated, Pagination } from '../../ultils/interface';
import {
  checkNegativeNumber,
  convertObjectId,
  removeNullValues,
} from '../../ultils';
import { DataUpdateInformationUser } from '../../user/user.dto';

@Injectable()
export class AuthRepository {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async findAll() {
    return await this.userModel.find().lean();
  }

  async findById(userId: string): Promise<IUserCreated | null> {
    const objectId = new mongoose.Types.ObjectId(userId);
    return await this.userModel.findOne({ _id: objectId }).lean();
  }

  async findByEmail(userEmail: string): Promise<IUserCreated | null> {
    return await this.userModel.findOne({ email: userEmail }).lean();
  }

  async findByUserName(keyword: string, pagination: Pagination) {
    const searchRegex = new RegExp(keyword, 'i');
    const { limit, page } = checkNegativeNumber(pagination);
    const offset = (page - 1) * limit;
    const users = await this.userModel.aggregate([
      {
        $project: {
          _id: 1,
          firstName: 1,
          lastName: 1,
          email: 1,
          avatarUrl: 1,
          isActive: 1,
        },
      },
      {
        $match: {
          isActive: true,
          $expr: {
            $regexMatch: {
              input: { $concat: ['$firstName', ' ', '$lastName'] },
              regex: searchRegex,
            },
          },
        },
      },
      {
        $skip: offset,
      },
      {
        $limit: limit,
      },
    ]);
    return {
      users,
      keyword,
    };
  }

  async activeUser(email: string) {
    return await this.userModel.findOneAndUpdate(
      { email },
      { isActive: true },
      { new: true },
    );
  }

  async changePassword(email: string, password: string) {
    return await this.userModel.findOneAndUpdate(
      { email },
      { password },
      { new: true },
    );
  }

  async changeEmail(user: IUserCreated, newEmail: string) {
    return await this.userModel.findOneAndUpdate(
      { _id: convertObjectId(user._id) },
      { email: newEmail },
      { new: true, upsert: true },
    );
  }

  async changeUsername(email: string, updated: ChangeUsername) {
    return await this.userModel.findOneAndUpdate(
      { email },
      { updated },
      { new: true },
    );
  }

  async changeUserAvatar(email: string, avatarUrl: string) {
    return await this.userModel.findOneAndUpdate(
      { email },
      { avatarUrl },
      { new: true },
    );
  }

  async create(data: UserRegister) {
    return await this.userModel.create(data);
  }

  async updateAll() {
    return await this.userModel.updateMany({
      friends: 0,
      viewer: 0,
      total_post: 0,
      job: 'Student',
      address: 'Viet Nam',
      social_github: 'default',
      social_facebook: 'default',
    });
  }

  async updateQuantityPost(userId: string, quantity: number) {
    if (quantity !== 1 && quantity !== -1) return;

    return await this.userModel.findOneAndUpdate(
      {
        _id: userId,
      },
      {
        $inc: {
          total_post: quantity,
        },
      },
    );
  }

  async increQuantityFriend(userId: string, quantity: number) {
    if (quantity !== 1 && quantity !== -1) return;

    return await this.userModel.findOneAndUpdate(
      {
        _id: userId,
      },
      {
        $inc: {
          friends: quantity,
        },
      },
    );
  }

  async increViewProfile(userId: string) {
    return await this.userModel.findOneAndUpdate(
      {
        _id: convertObjectId(userId),
      },
      {
        $inc: {
          viewer: 1,
        },
      },
    );
  }

  async updateSocialLink(userId: string, type: string, social_link: string) {
    const updatedField =
      type === 'Github' ? 'social_github' : 'social_facebook';

    return await this.userModel.findOneAndUpdate(
      { _id: convertObjectId(userId) },
      { [updatedField]: social_link },
      { new: true, upsert: true },
    );
  }

  async updateUserInformation(
    user: IUserCreated,
    data: DataUpdateInformationUser,
  ) {
    const dataUpdated = removeNullValues(data);
    return await this.userModel.findOneAndUpdate(
      {
        _id: convertObjectId(user._id),
      },
      dataUpdated,
      {
        new: true,
        upsert: true,
      },
    );
  }

  async lockedAccount(user: IUserCreated) {
    return await this.userModel.findOneAndUpdate(
      {
        _id: user._id,
      },
      {
        isActive: false,
      },
      {
        new: true,
        upsert: true,
      },
    );
  }
}
