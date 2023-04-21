import {
  Body,
  Controller,
  Get,
  Post,
  Res,
  Req,
  UseGuards,
  HttpStatus,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserLogin, UserRegister } from './auth.dto';
import { Response, Request } from 'express';
import { GoogleAuthGuard } from './google/google.guard';
import { IUserCreated } from './repository/auth.repository';
import { GitHubAuthGuard } from './github/github.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() body: UserRegister, @Res() res: Response) {
    const { refreshToken, response } = await this.authService.register(body);
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      maxAge: 129600000,
    });
    return response.sender(res);
  }

  @Post('login')
  async login(@Body() body: UserLogin, @Res() res: Response) {
    const { refreshToken, response } = await this.authService.login(body);
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      maxAge: 129600000,
    });
    return response.sender(res);
  }

  @Get('login/google')
  @UseGuards(GoogleAuthGuard)
  async loginWithGoogle() {
    try {
      return { msg: 'Ok' };
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  @Get('login/google/redirect')
  @UseGuards(GoogleAuthGuard)
  async loginWithGoogleRedirect(@Res() res: Response) {
    return res.status(HttpStatus.OK).json('Ok');
    // return res.redirect("")
  }

  @Get('login/github')
  @UseGuards(GitHubAuthGuard)
  async loginWithGithub() {
    try {
      return { msg: 'Ok' };
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  @Get('login/github/redirect')
  @UseGuards(GitHubAuthGuard)
  async loginWithGithubRedirect(@Res() res: Response) {
    return res.status(HttpStatus.OK).json('Ok');
    // return res.redirect("")
  }

  @Get('status')
  async getUser(@Res() res: Response, @Req() req: Request) {
    if (req.user) {
      const user = req.user as IUserCreated;
      const { refreshToken, response } = await this.authService.loginWithOauth2(
        user.email,
      );
      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        maxAge: 129600000,
      });
      return response.sender(res);
    } else {
      return res
        .status(HttpStatus.FORBIDDEN)
        .json({ msg: 'Un Authorization!' });
    }
  }
}
