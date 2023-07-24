import { Inject, Injectable } from '@nestjs/common';
import { Redis as IRedis } from 'ioredis';

@Injectable()
export class RedisService {
  constructor(@Inject('REDIS_CLIENT') private readonly redisClient: IRedis) {}

  async set(key: string, value: string, ttl: number = 60) {
    const pipeline = this.redisClient.pipeline();
    pipeline.set(key, value);
    pipeline.expire(key, ttl);
    await pipeline.exec();
  }

  async get(key: string) {
    return await this.redisClient.get(key);
  }

  async addToSet(key: string, members: string[], ttl: number = 60) {
    const pipeline = this.redisClient.pipeline();
    pipeline.sadd(key, ...members);
    pipeline.expire(key, ttl + Math.random() * 10);
    await pipeline.exec();
  }

  async removeToSet(key: string) {
    return await this.redisClient.srem(key);
  }

  async getMembersOfSet(key: string) {
    return await this.redisClient.smembers(key);
  }

  async isMemberOfSet(key: string, member: string) {
    return await this.redisClient.sismember(key, member);
  }

  async sCard(key: string) {
    return await this.redisClient.scard(key);
  }

  async ttl(key: string) {
    return await this.redisClient.ttl(key);
  }
}
