import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { loadEnv } from './config';
@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env'],
      isGlobal: true,
      load: [loadEnv],
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
