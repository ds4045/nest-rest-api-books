import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { AuthGuards } from './guards/auth.guard';
import { ItemEntity } from 'src/item/entities/item.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, ItemEntity])],
  controllers: [UserController],
  providers: [UserService, AuthGuards],
  exports: [UserService],
})
export class UserModule {}
