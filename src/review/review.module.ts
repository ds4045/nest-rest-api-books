import { Module } from '@nestjs/common';
import { ReviewService } from './review.service';
import { ReviewController } from './review.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReviewEntity } from './entities/review.entity';
import { AuthGuards } from 'src/user/guards/auth.guard';
import { ItemEntity } from 'src/item/entities/item.entity';
import { UserEntity } from 'src/user/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ReviewEntity, ItemEntity, UserEntity])],
  controllers: [ReviewController],
  providers: [ReviewService, AuthGuards],
})
export class ReviewModule {}
