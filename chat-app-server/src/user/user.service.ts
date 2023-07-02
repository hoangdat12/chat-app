import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { AuthRepository } from '../auth/repository/auth.repository';
import { ChangeUsername } from '../auth/auth.dto';
import { Ok } from '../ultils/response';
import { ConversationRepository } from '../conversation/conversation.repository';
import { IUserCreated, Pagination } from '../ultils/interface';

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

  async searchUser(keyword: string, pagination: Pagination) {
    return await this.authRepository.findByUserName(keyword.trim(), pagination);
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
}
