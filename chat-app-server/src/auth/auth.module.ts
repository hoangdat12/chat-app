import { Module } from '@nestjs/common';
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

@Module({
  imports: [MongooseModule.forFeature([UserModel, KeyTokenModel]), JwtModule],
  providers: [
    AuthService,
    AuthRepository,
    KeyTokenRepository,
    SessionSerializer,
    GoogleStrategy,
    GitHubStrategy,
  ],
  controllers: [AuthController],
  exports: [AuthRepository, KeyTokenRepository],
})
export class AuthModule {}
