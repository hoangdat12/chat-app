import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import {
  AuthRepository,
  IUserCreated,
} from '../auth/repository/auth.repository';
import { ChangeUsername } from '../auth/auth.dto';
import { Ok } from 'src/ultils/response';
import { Pagination } from '../message/message.repository';
import { ConversationRepository } from '../conversation/conversation.repository';

@Injectable()
export class UserService {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly conversationRepository: ConversationRepository,
  ) {}

  async getAllUser() {
    const users = await this.authRepository.findAll();
    return new Ok<any>(users, 'success');
  }

  async getUserDetail(userId: string) {
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
    // const conversations = this.conversationRepository.findConversationOfUser(user._id);
    // const groups = this.conversationRepository.findGroupOfUser(user._id);
    // const [conversations, groups] = await Promise.all([
    //   this.conversationRepository.findConversationOfUser(user._id),
    //   this.conversationRepository.findGroupOfUser(user._id),
    // ]);
    return await this.conversationRepository.findALl(
      user._id.toString(),
      pagination,
    );
    // return new Ok<any>({ conversations, groups }, 'success!');
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
}
