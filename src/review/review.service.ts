import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ReviewDto } from './dto/review.dto';
import { UserEntity } from 'src/user/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ItemEntity } from 'src/item/entities/item.entity';
import { ReviewEntity } from './entities/review.entity';

@Injectable()
export class ReviewService {
  constructor(
    @InjectRepository(ItemEntity)
    private readonly itemRepository: Repository<ItemEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(ReviewEntity)
    private readonly reviewRepository: Repository<ReviewEntity>,
  ) {}

  async findAll(): Promise<ReviewEntity[]> {
    return await this.reviewRepository.find();
  }

  async findOne(id: number) {
    return await this.reviewRepository.findOneBy({ id });
  }

  async updateOrDelete(
    operation: 'create' | 'update' | 'delete',
    userId: number,
    itemId: number,
    reviewId?: number,
    reviewDto?: ReviewDto,
  ): Promise<ReviewEntity> {
    const item = await this.itemRepository
      .createQueryBuilder('item')
      .leftJoinAndSelect('item.reviews', 'itemReviews')
      .where('item.id = :itemId', { itemId })
      .getOne();
    const user = await this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.reviews', 'userReviews')
      .where('user.id = :userId', { userId })
      .getOne();
    if (!item || !user) {
      throw new HttpException('Data does not exist', HttpStatus.NOT_FOUND);
    }
    let existingReview: ReviewEntity | undefined;
    if (reviewId) {
      existingReview = user.reviews.find((r) => r.id === reviewId);
      if (!existingReview) {
        throw new HttpException('Review does not exist', HttpStatus.NOT_FOUND);
      }
    }
    switch (operation) {
      case 'create':
        if (user.reviews.some((r) => r.itemId === itemId)) {
          throw new HttpException(
            'A review for this item already exists',
            HttpStatus.CONFLICT,
          );
        }
        const newReview = { ...new ReviewEntity(), ...reviewDto };
        newReview.authorId = user.id;
        newReview.authorName = user.name;
        newReview.itemId = item.id;
        newReview.userImageUrl = user.userImageUrl;
        newReview.itemImageUrl = item.itemImageUrl;
        newReview.itemTitle = item.title;
        user.reviews.push(newReview);
        item.reviews.push(newReview);
        item.averageRate = Math.round(
          item.reviews.reduce((acc, r) => acc + r.rate, 0) /
            item.reviews.length || 0,
        );
        await this.reviewRepository.save(newReview);
        await this.itemRepository.save(item);
        await this.userRepository.save(user);
        return newReview;
      case 'update':
        if (!existingReview) {
          throw new HttpException(
            'Review does not exist',
            HttpStatus.NOT_FOUND,
          );
        }
        existingReview.text = reviewDto.text || existingReview.text;
        existingReview.rate = reviewDto.rate || existingReview.rate;
        existingReview.date = reviewDto.date || existingReview.date;
        user.reviews = user.reviews.map((r) =>
          r.id === reviewId ? existingReview : r,
        );
        item.reviews = item.reviews.map((r) =>
          r.id === reviewId ? existingReview : r,
        );
        item.averageRate = Math.round(
          item.reviews.reduce((acc, r) => acc + r.rate, 0) /
            item.reviews.length || 0,
        );
        await this.reviewRepository.save(existingReview);
        await this.itemRepository.save(item);
        await this.userRepository.save(user);
        return existingReview;
      case 'delete':
        if (!existingReview) {
          throw new HttpException(
            'Review does not exist',
            HttpStatus.NOT_FOUND,
          );
        }
        user.reviews = user.reviews.filter((r) => r.id !== reviewId);
        item.reviews = item.reviews.filter((r) => r.id !== reviewId);
        item.averageRate = Math.round(
          item.reviews.reduce((acc, r) => acc + r.rate, 0) /
            item.reviews.length || 0,
        );
        await this.reviewRepository.delete(reviewId);
        await this.itemRepository.save(item);
        await this.userRepository.save(user);
        return existingReview;
      default:
        throw new HttpException('Invalid operation', HttpStatus.BAD_REQUEST);
    }
  }
}
