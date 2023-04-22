import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import {
  AuthRepository,
  IUserCreated,
} from '../auth/repository/auth.repository';
import { ChangeUsername } from '../auth/auth.dto';
import { Ok } from 'src/ultils/response';

@Injectable()
export class UserService {
  constructor(private readonly authRepository: AuthRepository) {}

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

  async changeUserAvatar(email: string, avatarUrl: string) {
    await this.checkUserExist(email);
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
