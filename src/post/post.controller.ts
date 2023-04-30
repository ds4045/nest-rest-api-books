import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  ValidationPipe,
  UsePipes,
  Put,
  Req,
  Query,
  UseFilters,
} from '@nestjs/common';
import { PostDto } from './dto/post.dto';
import { AuthGuards } from 'src/user/guards/auth.guard';
import { ApiTags } from '@nestjs/swagger';
import { PostService } from './post.service';
import { IExpressRequestUser } from 'src/user/user.type';
import { BadRequestFilter } from 'src/common/request.filter';
import { PostUpdateDto } from './dto/postUpdate.dto';
import { UserEntity } from 'src/user/entities/user.entity';

@Controller('post')
@ApiTags('post')
@UseFilters(BadRequestFilter)
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post('create')
  @UseGuards(AuthGuards)
  @UsePipes(new ValidationPipe())
  async create(
    @Req() request: IExpressRequestUser,
    @Body() createPostDto: PostDto,
  ): Promise<UserEntity> {
    return this.postService.create(createPostDto, request.user);
  }

  @Get('all')
  async findAll(@Query() query: any): Promise<PostUpdateDto[]> {
    if (!query.limit) {
      query.limit = '100';
    }
    return await this.postService.findAll(query);
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<PostUpdateDto> {
    return await this.postService.findOne(+id);
  }

  @Put(':id')
  @UseGuards(AuthGuards)
  @UsePipes(new ValidationPipe())
  async update(
    @Req() request: IExpressRequestUser,
    @Param('id') id: number,
    @Body() updatePostDto: PostUpdateDto,
  ): Promise<UserEntity> {
    return await this.postService.update(+id, updatePostDto, request.user);
  }

  @Delete(':id')
  @UseGuards(AuthGuards)
  async remove(
    @Req() request: IExpressRequestUser,
    @Param('id')
    id: number,
  ): Promise<UserEntity> {
    return await this.postService.remove(+id, request.user.id);
  }
}
