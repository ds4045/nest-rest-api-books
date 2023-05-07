import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Put,
  Req,
  ValidationPipe,
  UsePipes,
  UseFilters,
} from '@nestjs/common';
import { ReviewService } from './review.service';

import { AuthGuards } from 'src/user/guards/auth.guard';
import { ApiHeader, ApiTags } from '@nestjs/swagger';
import { IExpressRequestUser } from 'src/user/user.type';
import { ReviewDto } from './dto/review.dto';
import { ReviewEntity } from './entities/review.entity';
import { BadRequestFilter } from 'src/common/request.filter';

@Controller('review')
@ApiTags('review')
@UseFilters(BadRequestFilter)
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Post(':itemId')
  @UseGuards(AuthGuards)
  @ApiHeader({
    name: 'Authorization',
    description: 'JWT token',
  })
  @UsePipes(new ValidationPipe())
  async create(
    @Param('itemId') itemId: string,
    @Req() request: IExpressRequestUser,
    @Body() createReviewDto: ReviewDto,
  ): Promise<ReviewEntity> {
    return await this.reviewService.updateOrDelete(
      'create',
      request.user.id,
      +itemId,
      null,
      createReviewDto,
    );
  }

  @Get()
  async findAll(): Promise<ReviewEntity[]> {
    return await this.reviewService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.reviewService.findOne(+id);
  }

  @Put(':itemId/:reviewId')
  @UseGuards(AuthGuards)
  @ApiHeader({
    name: 'Authorization',
    description: 'JWT token',
  })
  @UsePipes(new ValidationPipe())
  async update(
    @Req() request: IExpressRequestUser,
    @Param('itemId') itemId: string,
    @Param('reviewId') reviewId: string,
    @Body() updateReviewDto: ReviewDto,
  ): Promise<ReviewEntity> {
    return await this.reviewService.updateOrDelete(
      'update',
      request.user.id,
      +itemId,
      +reviewId,
      updateReviewDto,
    );
  }

  @Delete(':itemId/:reviewId')
  @UseGuards(AuthGuards)
  @ApiHeader({
    name: 'Authorization',
    description: 'JWT token',
  })
  async remove(
    @Req() request: IExpressRequestUser,
    @Param('itemId') itemId: string,
    @Param('reviewId') reviewId: string,
  ): Promise<ReviewEntity> {
    return await this.reviewService.updateOrDelete(
      'delete',
      request.user.id,
      +itemId,
      +reviewId,
      null,
    );
  }
}
