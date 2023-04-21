import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../../schema/model/user.model';

export interface IUserDataCreate {
  email: string;
  firstName: string;
  lastName: string;
  password: string | undefined;
}

export interface IUserCreated extends User {
  id: string;
}

@Injectable()
export class AuthRepository {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async findById(userId: string): Promise<IUserCreated | null> {
    return await this.userModel.findById(userId).lean();
  }

  async findByEmail(userEmail: string): Promise<IUserCreated | null> {
    return await this.userModel.findOne({ email: userEmail }).lean();
  }

  async create(data: IUserDataCreate) {
    return await this.userModel.create(data);
  }
}
