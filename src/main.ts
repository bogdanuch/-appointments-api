import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { Logger, ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import * as process from 'process';
import { Client } from 'pg';

import { AppModule } from './app.module';

async function createDB() {
  const dbClient = new Client({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
  });
  try {
    dbClient.connect();
    await dbClient.query(`CREATE DATABASE ${process.env.DB_NAME}`);
    dbClient.end();
  } catch (e) {
    if (e.code !== '42P04') console.log('e', e);
  }
}

async function bootstrap() {
  await createDB();
  const app = await NestFactory.create(AppModule);
  const configService: ConfigService = app.get(ConfigService);
  app.enableCors();
  app.use(cookieParser());
  app.useGlobalPipes(new ValidationPipe());
  const docOptions = new DocumentBuilder()
    .setTitle('Nest Test Project')
    .setDescription('Nest Test Project')
    .setVersion('1')
    .addServer(
      `${configService.get<string>(
        'SERVER_PROTOCOL',
      )}://${configService.get<string>(
        'SERVER_HOST',
      )}:${configService.get<string>('SERVER_PORT')}`,
    )
    .build();
  const document = SwaggerModule.createDocument(app, docOptions);
  SwaggerModule.setup('/api/docs', app, document);
  await app.listen(configService.get<string>('SERVER_PORT'));
  Logger.log(
    `You can access api docker on the ${configService.get<string>(
      'SERVER_PROTOCOL',
    )}://${configService.get<string>(
      'SERVER_HOST',
    )}:${configService.get<string>('SERVER_PORT')}/api/docs`,
  );
}
bootstrap();
