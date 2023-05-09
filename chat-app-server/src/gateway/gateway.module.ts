import { Module } from '@nestjs/common';
import { MyGateWay } from './gateway';

@Module({
  imports: [MyGateWay],
})
export class GatewayModule {}
