import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Profile } from '../../schema/profile.model';
import { Model } from 'mongoose';
import { convertObjectId } from '../../ultils';

@Injectable()
export class ProfileRepository {
  constructor(
    @InjectModel(Profile.name)
    private readonly profileModel: Model<Profile>,
  ) {}

  async findByUserId(userId: string) {
    return await this.profileModel
      .findOne({
        profile_user: convertObjectId(userId),
      })
      .populate(['profile_user', 'profile_address']);
  }

  async increViewProfile(userId: string) {
    return await this.profileModel.findOneAndUpdate(
      {
        profile_user: convertObjectId(userId),
      },
      {
        $inc: {
          profile_viewer: 1,
        },
      },
    );
  }

  async updateQuantityPost(userId: string, quantity: number) {
    if (quantity !== 1 && quantity !== -1) return;

    return await this.profileModel.findOneAndUpdate(
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

    return await this.profileModel.findOneAndUpdate(
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
