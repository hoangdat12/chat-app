import { Module, Global } from '@nestjs/common';
import Redis from 'ioredis';
import { RedisService } from './redis.service';

@Global()
@Module({
  providers: [
    {
      provide: 'REDIS_CLIENT',
      useFactory: () => {
        return new Redis({
          password: 'wV4ju87vxqX13N9L0up1GBkyJyKf5Ish',
          host: 'redis-11977.c292.ap-southeast-1-1.ec2.cloud.redislabs.com',
          port: 11977,
        });
      },
    },
    RedisService,
  ],
  exports: ['REDIS_CLIENT', RedisService],
})
export class RedisModule {}
