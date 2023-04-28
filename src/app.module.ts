import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './user/entities/user.entity';
import { ItemModule } from './item/item.module';
import { ReviewModule } from './review/review.module';
import { PostModule } from './post/post.module';
import { ItemEntity } from './item/entities/item.entity';
import { ReviewEntity } from './review/entities/review.entity';
import { PostEntity } from './post/entities/post.entity';
import { AuthMiddleware } from './user/middlewares/auth.middlewares';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT || 5432,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      synchronize: true,
      entities: [UserEntity, ItemEntity, ReviewEntity, PostEntity],
    }),
    UserModule,
    ItemModule,
    ReviewModule,
    PostModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes({
      path: '*',
      method: RequestMethod.ALL,
    });
  }
}
