import {
  CacheModule,
  CacheModuleAsyncOptions,
  MiddlewareConsumer,
  Module,
  NestModule,
} from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
 
import helmet from 'helmet';
import { AuthController } from './auth/auth.controller';

import { UserController } from './user/user.controller';
import cors from 'cors';
import * as redis from 'redis'; // Import the 'redis' library

import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import * as redisStore from 'cache-manager-redis-store'; // Correct import statement
import { AcessTokenGuard } from './auth/guards';
 
import { RoleGuard } from './user/guards/user.guard';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ScheduleModule } from '@nestjs/schedule';
import { CacheInterceptor } from '@nestjs/cache-manager';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    CacheModule.registerAsync({
      isGlobal: true,
      useFactory: (): CacheModuleAsyncOptions => ({
        imports: [ConfigModule],
        useFactory: (configService: ConfigService) => {
          const client = redis.createClient({
            socket: {
              host: 'localhost',
              port: 6379,
            },
          });
          return {
            store: require('cache-manager').caching({
              store: redisStore,
              client,
            }),
          };
        },
        inject: [ConfigService],
      }),
    }),
    // CorsModule.forRoot({
    //   origin: ['http://localhost:3000'], // Allow requests from this origin
    //   methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // Allowed HTTP methods
    //   credentials: true, // Include cookies and HTTP authentication information
    //   allowedHeaders: 'Content-Type,Authorization', // Allowed headers
    // }),
    // CacheModule.register({
    //   store: require('cache-manager-redis-store'), // Use 'cache-manager-redis-store'
    //   host: 'localhost',
    //   port: 6379,
    // }),

    EventEmitterModule.forRoot(),
    ScheduleModule.forRoot(),
    AuthModule,
    UserModule,
    PrismaModule,
 
  ],
  controllers: [AppController],
  providers: [
    AppService,

    { provide: APP_GUARD, useClass: AcessTokenGuard },
    { provide: APP_GUARD, useClass: RoleGuard },
    {
      provide: APP_INTERCEPTOR,
      useClass: CacheInterceptor,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(cors,  helmet())
      .forRoutes(AuthController, UserController);
  }
}
