import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ConfigModule as NestConfigModule } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { RedisModule } from '@nestql/redis';

import { AppService } from './app.service';
import { AppController } from './app.controller';

import { AuthModule } from './auth/auth.module';
import { RolesGuard } from './auth/roles.guard';
import { AuthGuard } from './auth/auth.guard';

import { ConfigModule } from './config/config.module';
import { ConfigService } from './config/config.service';
import { envSchema } from './config/config';

@Module({
  imports: [
    NestConfigModule.forRoot({
      validate: (env) => envSchema.parse(env),
      isGlobal: true,
    }),

    ConfigModule,

    SequelizeModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        dialect: 'postgres',
        host: 'db', // localhost | db
        port: configService.get('PORT_DB'),
        username: configService.get('DB_USER'),
        password: configService.get('DB_PASS'),
        database: configService.get('DB_NAME'),
        autoLoadModels: true,
        synchronize: true,
      }),
      inject: [ConfigService],
    }),

    RedisModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        name: '__sessions__',
        host: 'redis', // localhost | redis
        port: configService.get('PORT_REDIS'),
      }),
      inject: [ConfigService],
    }),

    AuthModule,
  ],

  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
    AppService,
  ],

  controllers: [AppController],
})
export class AppModule {}
