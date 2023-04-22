import { Module, Global } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModel } from '../schema/model/user.model';
import { AuthRepository } from './repository/auth.repository';
import { JwtModule } from '../jwt/jwt.module';
import { KeyTokenModel } from '../schema/model/keyToken.model';
import { KeyTokenRepository } from './repository/keyToken.repository';
import { SessionSerializer } from './google/sesstion.serializer';
import { GoogleStrategy } from './google/google.strategy';
import { GitHubStrategy } from './github/github.strategy';
import { OtpModel } from '../schema/model/otpToken.model';
import { OtpTokenRepository } from './repository/otpToken.repository';
import { MailSenderModule } from '../mail-sender/mail-sender.module';

@Global()
@Module({
  imports: [
    MongooseModule.forFeature([UserModel, KeyTokenModel, OtpModel]),
    JwtModule,
    MailSenderModule,
  ],
  providers: [
    AuthService,
    AuthRepository,
    KeyTokenRepository,
    OtpTokenRepository,
    SessionSerializer,
    GoogleStrategy,
    GitHubStrategy,
  ],
  controllers: [AuthController],
  exports: [AuthRepository, KeyTokenRepository],
})
export class AuthModule {}
