import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { AuthRepository } from './repository/auth.repository';
import { ChangePassword, UserLogin, UserRegister } from './auth.dto';
import * as bcrypt from 'bcrypt';
import { Created, Ok } from '../ultils/response';
import * as crypto from 'crypto';
import { JwtService } from '../jwt/jwt.service';
import { KeyTokenRepository } from './repository/keyToken.repository';
import { Request } from 'express';
import { OtpTokenRepository } from './repository/otpToken.repository';
import { MailSenderService } from '../mail-sender/mail-sender.service';
import {
  activeAccountTemplate,
  confirmEmail,
} from '../mail-sender/mail-sender.template';
import { ILoginWithGoogleData } from '../ultils/interface';
import { IUserCreated } from '../ultils/interface';
import { convertUserIdString, getUsername } from '../ultils';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly authRepository: AuthRepository,
    private readonly keyTokenRepository: KeyTokenRepository,
    private readonly otpTokenRepository: OtpTokenRepository,
    private readonly mailSender: MailSenderService,
  ) {}

  async register(data: UserRegister) {
    const { email, password } = data;

    const userExist = await this.authRepository.findByEmail(email);
    if (userExist)
      throw new HttpException('User already Eixst!', HttpStatus.CONFLICT);

    const hashPassword = bcrypt.hashSync(password, 10);

    const newUser = await this.authRepository.create({
      ...data,
      password: hashPassword,
    });
    if (!newUser)
      throw new HttpException(
        'User already Eixst!',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );

    const otpToken = await this.otpTokenRepository.createOtpToken(email);
    // Send mail
    const link = `http://localhost:8080/api/v1/auth/active/${otpToken?.token}`;
    const userName = `${newUser.firstName} ${newUser.lastName}`;
    const content = activeAccountTemplate(userName, link);
    await this.mailSender.sendEmailWithText(
      email,
      'Active your Account',
      content,
    );

    return new Created<string>(
      `We send a email for account ${email}, please follow the guide to activate your account`,
      'Register success!',
    );
  }

  async activeAccount(tokenActive: string) {
    if (!tokenActive)
      throw new HttpException('Missing value!', HttpStatus.BAD_REQUEST);

    const otpToken = await this.otpTokenRepository.findByToken(tokenActive);
    if (!otpToken) throw new HttpException('Not found', HttpStatus.NOT_FOUND);

    const userUpdate = await this.authRepository.activeUser(otpToken.email);
    if (!userUpdate) throw new HttpException('Not found', HttpStatus.NOT_FOUND);

    await this.otpTokenRepository.deleteByToken(tokenActive);
    const user = convertUserIdString(userUpdate);
    return { isValid: true, user };
  }

  async login(data: UserLogin) {
    const { email, password } = data;
    const user = await this.authRepository.findByEmail(email);
    if (!user) throw new HttpException('User not found!', HttpStatus.NOT_FOUND);

    if (user.loginWith !== 'email')
      throw new HttpException(
        'User is already login with google!',
        HttpStatus.NOT_FOUND,
      );

    const isValidPassword = bcrypt.compareSync(password, user.password);
    if (!isValidPassword)
      throw new HttpException('Wrong password!', HttpStatus.NOT_FOUND);

    if (!user.isActive)
      throw new HttpException(
        'Accoutn is not active, please check email to active you account!',
        HttpStatus.BAD_REQUEST,
      );
    delete user.password;

    const { publicKey, privateKey } = this.generateKeyPair();
    const payload = {
      id: user._id,
      email: user.email,
    };
    const { accessToken, refreshToken } = this.jwtService.createTokenPair(
      payload,
      privateKey,
    );

    const dataKeyToken = {
      user: user,
      refreshToken,
      publicKey,
      privateKey,
    };
    await this.keyTokenRepository.createKeyToken(dataKeyToken);

    const metaData = {
      user: user,
      token: accessToken,
      refreshToken,
    };

    return {
      refreshToken,
      response: new Ok(metaData, 'Login success!'),
    };
  }

  async handleLoginWithOauth2(data: ILoginWithGoogleData) {
    const userExist = await this.authRepository.findByEmail(data.email);
    if (userExist) {
      delete userExist.password;
      return userExist;
    } else {
      const inforUser = {
        ...data,
        password: crypto.randomBytes(10).toString('hex'),
        isActive: true,
      };
      const newUser = await this.authRepository.create(inforUser);

      if (!newUser)
        throw new HttpException('DB error!', HttpStatus.INTERNAL_SERVER_ERROR);
      else return newUser;
    }
  }

  async loginWithOauth2(email: string) {
    const userExist = await this.authRepository.findByEmail(email);
    if (!userExist)
      throw new HttpException('User not found!', HttpStatus.NOT_FOUND);

    const { privateKey } = this.generateKeyPair();

    const payload = {
      id: userExist._id,
      email: userExist.email,
    };

    delete userExist.password;
    const { accessToken, refreshToken } = this.jwtService.createTokenPair(
      payload,
      privateKey,
    );

    const metaData = {
      user: userExist,
      token: accessToken,
      refreshToken,
    };

    return {
      refreshToken,
      response: new Ok<any>(metaData, 'Login sucess!'),
    };
  }

  async logout(req: Request) {
    const user = req.user as IUserCreated;
    await this.keyTokenRepository.deleteByUserId(user._id);
    return new Ok<string>('Logout success!');
  }

  async forgetPassword(email: string) {
    const userExist = await this.authRepository.findByEmail(email);
    if (!userExist)
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);

    if (userExist.loginWith !== 'email') {
      return new Ok<string>(`Not valid!`, 'Error!');
    } else {
      const otpToken = await this.otpTokenRepository.createOtpToken(email);
      console.log(otpToken);
      // Send mail
      const link = `http://localhost:8080/verify-otp/${otpToken.token}`;
      const userName = getUsername(userExist);
      const content = confirmEmail(userName, link);
      await this.mailSender.sendEmailWithText(
        email,
        'Change Password',
        content,
      );

      return new Ok<string>(
        `We send email ${email} an account activation link, please follow the instructions to activate your account`,
        'Success!',
      );
    }
  }

  async verifyOtpToken(token: string) {
    const otpToken = await this.otpTokenRepository.findByToken(token);
    return new Ok<any>(otpToken, 'Success!');
  }

  async changePassword(data: ChangePassword, secret: string) {
    const otpToken = await this.otpTokenRepository.findBySecret(secret);
    if (!otpToken) throw new HttpException('Wrong!', HttpStatus.BAD_REQUEST);

    const email = data.email;
    const userExist = await this.authRepository.findByEmail(email);
    if (!userExist)
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);

    const isValidPassword = bcrypt.compareSync(
      data.olderPassword,
      userExist.password,
    );
    if (!isValidPassword)
      throw new HttpException('Wrong older Password!', HttpStatus.BAD_REQUEST);

    const hashPassword = bcrypt.hashSync(data.newPassword, 10);
    const userChangePassoword = await this.authRepository.changePassword(
      email,
      hashPassword,
    );
    if (!userChangePassoword)
      throw new HttpException('DB error!', HttpStatus.INTERNAL_SERVER_ERROR);

    return new Ok<string>('Change password success!', 'success');
  }

  generateKeyPair() {
    return crypto.generateKeyPairSync('rsa', {
      modulusLength: 4096,
      publicKeyEncoding: {
        type: 'pkcs1',
        format: 'pem',
      },
      privateKeyEncoding: {
        type: 'pkcs1',
        format: 'pem',
      },
    });
  }
}
