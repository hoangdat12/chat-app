import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { AuthRepository } from '../auth/repository/auth.repository';
import { ChangeUsername } from '../auth/auth.dto';
import { Ok } from '../ultils/response';
import { ConversationRepository } from '../conversation/conversation.repository';
import { IUserCreated, Pagination } from '../ultils/interface';
import { RedisService } from '../redis/redis.service';
import { DataUpdateInformationUser, IDataChangeSocialLink } from './user.dto';
import { removeNullValues } from '../ultils';

@Injectable()
export class UserService {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly conversationRepository: ConversationRepository,
    private readonly redisService: RedisService,
  ) {}

  async getAllUser() {
    const users = await this.authRepository.findAll();
    return new Ok<any>(users, 'success');
  }

  async searchUser(keyword: string, pagination: Pagination) {
    return await this.authRepository.findByUserName(keyword.trim(), pagination);
  }

  async getUserDetail(user: IUserCreated, userId: string) {
    if (user._id !== userId) {
      const key = `user:${user._id}:profile:${userId}`;
      // If haven't key then increment view profile
      if (!(await this.redisService.get(key))) {
        // Set key
        await this.redisService.set(key, 'view');
        // increment
        this.authRepository.increViewProfile(userId);
      }
    }
    const userExist = await this.authRepository.findById(userId);
    if (!userExist)
      throw new HttpException('User not found!', HttpStatus.NOT_FOUND);
    delete userExist.password;
    return new Ok<any>(userExist, 'success');
  }

  async changeUserName(user: IUserCreated, data: ChangeUsername) {
    const email = user.email;
    await this.checkUserExist(email);

    const userUpdate = this.authRepository.changeUsername(email, data);
    if (!userUpdate)
      throw new HttpException('DB error!', HttpStatus.INTERNAL_SERVER_ERROR);

    return new Ok<string>('Change username success!', 'Success');
  }

  async getConversation(user: IUserCreated, pagination: Pagination) {
    return await this.conversationRepository.findConversationOfUser(
      user._id.toString(),
      pagination,
    );
  }

  async changeUserAvatar(email: string, avatarUrl: string) {
    const userUpdate = await this.authRepository.changeUserAvatar(
      email,
      avatarUrl,
    );

    if (!userUpdate)
      throw new HttpException('DB error!', HttpStatus.INTERNAL_SERVER_ERROR);

    return new Ok<string>(avatarUrl, 'Change avatar success!');
  }

  async checkUserExist(email: string) {
    const userExist = await this.authRepository.findByEmail(email);
    if (!userExist)
      throw new HttpException('User not found!', HttpStatus.NOT_FOUND);
    return userExist;
  }

  async updateSocialLink(user: IUserCreated, data: IDataChangeSocialLink) {
    let { type, social_link } = data;
    social_link = social_link.trim();
    if (type !== 'Facebook' && type !== 'Github')
      throw new HttpException('Not valid type!', HttpStatus.BAD_REQUEST);

    if (!social_link.startsWith('https://'))
      throw new HttpException('Not valid link', HttpStatus.BAD_REQUEST);

    return await this.authRepository.updateSocialLink(
      user._id,
      type,
      social_link,
    );
  }

  async changeUserInformation(
    user: IUserCreated,
    data: DataUpdateInformationUser,
  ) {
    let { firstName, lastName, job } = data;
    firstName = firstName.trim();
    lastName = lastName.trim();
    job = job.trim();

    let condition =
      firstName === null &&
      lastName === null &&
      job === null &&
      (firstName === '' || lastName !== '' || job !== '');

    if (condition)
      throw new HttpException('Invalid Value!', HttpStatus.BAD_REQUEST);

    const foundUser = await this.authRepository.findById(user._id);
    if (!foundUser)
      throw new HttpException('User not found', HttpStatus.BAD_REQUEST);

    condition =
      foundUser.firstName === firstName &&
      foundUser.lastName === lastName &&
      foundUser.job === job;
    if (condition)
      throw new HttpException('Invalid Value!', HttpStatus.BAD_REQUEST);

    return await this.authRepository.updateUserInformation(user, {
      firstName,
      lastName,
      job,
    });
  }

  async fixBug() {
    return await this.authRepository.updateAll();
  }
}
