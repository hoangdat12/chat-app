import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { AuthRepository } from './repository/auth.repository';
import { UserLogin, UserRegister } from './auth.dto';
import * as bcrypt from 'bcrypt';
import { Created, Ok } from '../ultils/response';
import * as crypto from 'crypto';
import { JwtService } from '../jwt/jwt.service';
import { KeyTokenRepository } from './repository/keyToken.repository';

export interface ILoginWithGoogleData {
  email: string;
  firstName: string | null;
  lastName: string;
  avatarUrl: string;
  loginWith: string;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly jwtService: JwtService,
    private readonly keyToeknRepository: KeyTokenRepository,
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

    const { privateKey, publicKey } = await this.generateKeyPair();

    const payload = {
      id: newUser.id,
      email: newUser.email,
    };
    const { accessToken, refreshToken } = this.jwtService.createTokenPair(
      payload,
      privateKey,
    );

    const dataKeyToken = {
      user: newUser,
      refreshToken,
      publicKey,
      privateKey,
    };
    await this.keyToeknRepository.createKeyToken(dataKeyToken);

    delete newUser.password;
    const metaData = {
      user: newUser,
      token: accessToken,
    };
    return {
      response: new Created<any>(metaData, 'Register success!'),
      refreshToken,
    };
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

    delete user.password;

    const { privateKey } = this.generateKeyPair();
    const payload = {
      id: user.id,
      email: user.email,
    };
    const { accessToken, refreshToken } = this.jwtService.createTokenPair(
      payload,
      privateKey,
    );

    const metaData = {
      user: user,
      token: accessToken,
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
      id: userExist.id,
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
    };

    return {
      refreshToken,
      response: new Ok<any>(metaData, 'Login sucess!'),
    };
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
