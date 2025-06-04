import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import * as express from 'express';
import { join } from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CategoriesModule } from './categories/categories.module';
import { TagsModule } from './tags/tags.module';
import { EventActionsModule } from './event-actions/event-actions.module';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ImagesModule } from './images/images.module';
import { PromotionEventsModule } from './promotion-events/promotion-events.module';
import { PromotionsModule } from './promotions/promotions.module';
import { CurrenciesModule } from './currencies/currencies.module';

@Module({
  imports: [
    AuthModule,
    UsersModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    CategoriesModule,
    TagsModule,
    EventActionsModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService): TypeOrmModuleOptions => {
        return {
          type: 'postgres',
          host: configService.get<string>('DB_HOST')!,
          port: configService.get<number>('DB_PORT')!,
          username: configService.get<string>('DB_USERNAME')!,
          password: configService.get<string>('DB_PASSWORD')!,
          database: configService.get<string>('DB_DATABASE')!,
          // entities: [__dirname + '/**/*.entity{.ts,.js}'],
          synchronize: configService.get<boolean>('DB_SYNCHRONIZE')!,
          autoLoadEntities: true,
          extra: {
            max: 2000000,
          },
        };
      },
    }),
    ImagesModule,
    PromotionEventsModule,
    PromotionsModule,
    CurrenciesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(express.static(join(process.cwd(), 'uploads')))
      .forRoutes('/uploads');
  }
}
