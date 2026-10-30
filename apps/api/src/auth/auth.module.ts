import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserWorkspaceService } from './user-workspace.service';
import { EmailService } from '../testing/email.service';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'fallback-jwt-secret-for-dev',
      signOptions: { expiresIn: '7d' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, UserWorkspaceService, EmailService],
  exports: [AuthService, UserWorkspaceService, EmailService],
})
export class AuthModule {}
