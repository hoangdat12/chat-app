import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../../schema/model/user.model';
import { ChangePassword, ChangeUsername } from '../auth.dto';

export interface IUserDataCreate {
  email: string;
  firstName: string;
  lastName: string;
  password: string | undefined;
}

export interface IUserCreated extends User {
  _id: string;
}

@Injectable()
export class AuthRepository {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async findAll() {
    return await this.userModel.find().lean();
  }

  async findById(userId: string): Promise<IUserCreated | null> {
    return await this.userModel.findOne({ _id: userId }).lean();
  }

  async findByEmail(userEmail: string): Promise<IUserCreated | null> {
    return await this.userModel.findOne({ email: userEmail }).lean();
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

  async create(data: IUserDataCreate) {
    return await this.userModel.create(data);
  }
}
