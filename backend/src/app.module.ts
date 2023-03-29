import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { DocumentsModule } from './documents/documents.module';
import { NewsModule } from './news/news.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RequestsModule } from './requests/requests.module';
import entities from './typeorm';
import { JwtModule } from '@nestjs/jwt';
import { isAuthenticated } from './app.middleware';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    UsersModule,
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST'),
        port: +configService.get<number>('DB_PORT'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_NAME'),
        entities,
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
    RequestsModule,
    DocumentsModule,
    NewsModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        return {
          secret: configService.get('JWT_SECRET'),
          signOptions: { expiresIn: '3h' },
        };
      },
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(isAuthenticated)
      .exclude(
        { path: 'users/signIn', method: RequestMethod.POST },
        { path: 'users/signUp', method: RequestMethod.POST },
      )
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
