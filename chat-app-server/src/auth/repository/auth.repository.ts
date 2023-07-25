import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { User } from '../../schema/user.model';
import { ChangeUsername, UserRegister } from '../auth.dto';
import { IUserCreated, Pagination } from '../../ultils/interface';
import { checkNegativeNumber } from '../../ultils';

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
    const users = await this.userModel
      .aggregate([
        {
          $project: {
            firstName: 1,
            lastName: 1,
            userName: { $concat: ['$firstName', ' ', '$lastName'] },
            email: 1,
            avatarUrl: 1,
            isActive: 1,
          },
        },
        {
          $match: {
            userName: {
              $regex: searchRegex,
            },
            isActive: true,
          },
        },
        {
          $sort: {
            userName: 1,
          },
        },
      ])
      .skip(offset)
      .limit(limit);
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
}
