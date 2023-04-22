import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { OtpToken } from '../../schema/model/otpToken.model';
import { Model } from 'mongoose';
import * as crypto from 'crypto';

export interface IOtpTokenCreate {
  email: string;
  token: string;
  secret: string;
}

@Injectable()
export class OtpTokenRepository {
  constructor(
    @InjectModel(OtpToken.name) private readonly otpTokenModel: Model<OtpToken>,
  ) {}
  async findByToken(token: string) {
    return await this.otpTokenModel.findOne({ token: token }).lean();
  }

  async findByEmail(email: string) {
    return await this.otpTokenModel.findOne({ email }).lean();
  }

  async findBySecret(secret: string) {
    return await this.otpTokenModel.findOne({ secret }).lean();
  }

  async create(data: IOtpTokenCreate) {
    return await this.otpTokenModel.create(data);
  }

  async deleteByToken(token: string) {
    return await this.otpTokenModel.deleteOne({ token });
  }

  async createOtpToken(email: string) {
    const data = {
      email,
      token: crypto.randomBytes(20).toString('hex'),
      secret: crypto.randomBytes(10).toString('hex'),
    };

    return await this.otpTokenModel.create(data);
  }
}
