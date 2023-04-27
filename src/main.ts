import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { CreateUserDto } from './user/dto/create-user.dto';
import { LoginUserDto } from './user/dto/login-user.dto';
import { UpdateUserDto } from './user/dto/update-user.dto';
import { ItemDto } from './item/dto/item.dto';
import { ReviewDto } from './review/dto/review.dto';
import { PostDto } from './post/dto/post.dto';
async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: false });
  app.enableCors({ origin: true, credentials: true });
  const config = new DocumentBuilder()
    .setTitle('API BOOKS')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config, {
    extraModels: [
      CreateUserDto,
      LoginUserDto,
      UpdateUserDto,
      ItemDto,
      ReviewDto,
      PostDto,
    ],
  });
  SwaggerModule.setup('swagger', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });
  await app.listen(5555);
}
bootstrap();
