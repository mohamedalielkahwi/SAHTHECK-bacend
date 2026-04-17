import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { ConfigModule } from '@nestjs/config';
import jwtConfig from './config/jwt.config';
import refreshJwtConfig from './config/refresh-jwt.config';
import { JwtModule } from '@nestjs/jwt';
import { GoogleStrategy } from './strategies/google.strategy';
import { OtpModule } from 'src/otp/otp.module';
import { MinioModule } from 'src/minio/minio.module';
import { ChatModule } from 'src/chat/chat.module';

@Module({
  imports: [
    JwtModule.registerAsync(jwtConfig.asProvider()),
    ConfigModule.forFeature(jwtConfig),
    ConfigModule.forFeature(refreshJwtConfig),
    OtpModule,
    MinioModule,
    ChatModule,
  ],
  controllers: [UsersController],
  providers: [UsersService,GoogleStrategy],
})
export class UsersModule {}