import { Module } from '@nestjs/common';
import { DoctorsController } from './doctors.controller';
import { DoctorsService } from './doctors.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import jwtConfig from 'src/users/config/jwt.config';
import { MinioModule } from 'src/minio/minio.module';
import { ChatModule } from 'src/chat/chat.module';

@Module({
  imports: [
    JwtModule.registerAsync(jwtConfig.asProvider()),
    ConfigModule.forFeature(jwtConfig),
    MinioModule,
    ChatModule,
  ],
  controllers: [DoctorsController],
  providers: [DoctorsService]
})
export class DoctorsModule {}
