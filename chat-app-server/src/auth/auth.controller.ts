import {
  Body,
  Controller,
  Get,
  Post,
  Res,
  Req,
  UseGuards,
  HttpStatus,
  Param,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { ChangePassword, UserLogin, UserRegister } from './auth.dto';
import { Response, Request } from 'express';
import { GoogleAuthGuard } from './google/google.guard';
import { GitHubAuthGuard } from './github/github.guard';
import { JwtService } from '../jwt/jwt.service';
import { IUserCreated } from '../ultils/interface';
import { validate } from 'class-validator';
import { Ok } from '../ultils/response';
import { FriendService } from '../friend/friend.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly jwtService: JwtService,
    private readonly friendService: FriendService,
  ) {}

  @Post('register')
  async register(@Body() body: UserRegister, @Res() res: Response) {
    try {
      const errors = await validate(body);
      if (errors.length > 0) {
        throw new Error('Missing value!');
      }
      return (await this.authService.register(body)).sender(res);
    } catch (err) {
      throw err;
    }
  }

  @Get('active/:token')
  async activeAccount(@Param('token') token: string, @Res() res: Response) {
    try {
      const { isValid, user } = await this.authService.activeAccount(token);
      if (isValid) {
        await this.friendService.create(user);
        return res.redirect('http://localhost:5173/login');
      } else {
        return res.redirect('http://localhost:5173/error');
      }
    } catch (err) {
      throw err;
    }
  }

  @Post('login')
  async login(@Body() body: UserLogin, @Res() res: Response) {
    try {
      const errors = await validate(body);
      if (errors.length > 0) {
        throw new Error('Missing value!');
      }
      const { refreshToken, response } = await this.authService.login(body);
      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        maxAge: 1000 * 60 * 15,
      });
      return response.sender(res);
    } catch (err) {
      throw err;
    }
  }

  @Get('login/google')
  @UseGuards(GoogleAuthGuard)
  async loginWithGoogle() {
    try {
      return { msg: 'Ok' };
    } catch (err) {
      throw err;
    }
  }

  @Get('login/google/redirect')
  @UseGuards(GoogleAuthGuard)
  async loginWithGoogleRedirect(@Res() res: Response) {
    return res.redirect('http://localhost:5173/login/success');
  }

  @Get('login/github')
  @UseGuards(GitHubAuthGuard)
  async loginWithGithub() {
    try {
      return { msg: 'Ok' };
    } catch (err) {
      throw err;
    }
  }

  @Get('login/github/redirect')
  @UseGuards(GitHubAuthGuard)
  async loginWithGithubRedirect(@Res() res: Response) {
    return res.redirect('http://localhost:5173/login/success');
  }

  @Get('status')
  async getUser(@Res() res: Response, @Req() req: Request) {
    try {
      if (req.user) {
        const user = req.user as IUserCreated;
        const { refreshToken, response } =
          await this.authService.loginWithOauth2(user.email);
        return response.sender(res);
      } else {
        return res
          .status(HttpStatus.FORBIDDEN)
          .json({ msg: 'Un Authorization!' });
      }
    } catch (err) {
      throw err;
    }
  }

  @Post('refresh-token')
  async refreshToken(@Req() req: Request, @Res() res: Response) {
    try {
      const { refreshToken, accessToken } = await this.jwtService.refreshToken(
        req,
      );
      // res.cookie('refreshToken', refreshToken, {
      //   httpOnly: true,
      //   maxAge: 129600000,
      // });
      return new Ok({ refreshToken, token: accessToken }).sender(res);
    } catch (err) {
      throw err;
    }
  }

  @Post('logout')
  async logout(@Req() req: Request, @Res() res: Response) {
    try {
      return (await this.authService.logout(req)).sender(res);
    } catch (err) {
      throw err;
    }
  }

  @Post('forgot-password')
  async forgotPassword(@Body('email') email: string) {
    try {
      return await this.authService.forgetPassword(email);
    } catch (err) {
      throw err;
    }
  }

  @Post('verify-otp/:token')
  async verifyOtpToken(@Param('token') token: string) {
    try {
      return await this.authService.verifyOtpToken(token);
    } catch (err) {
      throw err;
    }
  }

  @Post('change-password/:secret')
  async changPassword(
    @Body() data: ChangePassword,
    @Param('secret') secret: string,
  ) {
    try {
      const errors = await validate(data);
      if (errors.length > 0) {
        throw new Error('Missing value!');
      }
      return await this.authService.changePassword(data, secret);
    } catch (err) {
      throw err;
    }
  }
}
