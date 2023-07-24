import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { MessageModule } from './message/message.module';
import { JwtModule } from './jwt/jwt.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { PassportModule } from '@nestjs/passport';
import { JwtMiddleWare } from './jwt/jwt.middleware';
import { MailSenderModule } from './mail-sender/mail-sender.module';
import { ConversationModule } from './conversation/conversation.module';
import { GatewayModule } from './gateway/gateway.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { FriendModule } from './friend/friend.module';
import { NotifyModule } from './notify/notify.module';
import { PostModule } from './post/post.module';
import { RedisModule } from './redis/redis.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(process.env.MONGODB_URI),
    EventEmitterModule.forRoot(),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
      serveStaticOptions: {
        redirect: false,
        index: false,
      },
    }),

    PassportModule.register({ session: true }),
    RedisModule,
    AuthModule,
    UserModule,
    MessageModule,
    JwtModule,
    MailSenderModule,
    ConversationModule,
    GatewayModule,
    FriendModule,
    NotifyModule,
    PostModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(JwtMiddleWare).exclude('auth/(.*)').forRoutes('*');

    consumer
      .apply(JwtMiddleWare)
      .forRoutes({ path: 'auth/logout', method: RequestMethod.POST });
  }
}
