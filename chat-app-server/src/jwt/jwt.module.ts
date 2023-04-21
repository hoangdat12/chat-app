import { Module } from '@nestjs/common';
import { JwtService } from './jwt.service';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [AuthModule],
  providers: [JwtService],
  exports: [JwtService],
})
export class JwtModule {}
