import { Module } from '@nestjs/common';
import { MessagingGateway } from './gateway';
import { GatewaySessionManager } from './gateway.sesstion';
import { Services } from '../ultils/constant';

@Module({
  imports: [],
  providers: [
    MessagingGateway,
    {
      provide: Services.GATEWAY_SESSION_MANAGER,
      useClass: GatewaySessionManager,
    },
  ],
  exports: [
    MessagingGateway,
    {
      provide: Services.GATEWAY_SESSION_MANAGER,
      useClass: GatewaySessionManager,
    },
  ],
})
export class GatewayModule {}
