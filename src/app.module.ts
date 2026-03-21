import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { PrismaModule } from './prisma/prisma.module';
import { LoggerMiddleware } from './common/logger.middleware';
import { OtpModule } from './otp/otp.module';
import { MinioModule } from './minio/minio.module';

@Module({
  imports: [
    UsersModule,
    PrismaModule,
    OtpModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MinioModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .forRoutes('*');
  }
}
