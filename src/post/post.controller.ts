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
} from '@nestjs/common';
import { PostDto } from './dto/post.dto';
import { AuthGuards } from 'src/user/guards/auth.guard';
import { ApiTags } from '@nestjs/swagger';
import { PostService } from './post.service';
import { IExpressRequestUser } from 'src/user/user.type';
import { PostEntity } from './entities/post.entity';

@Controller('post')
@ApiTags('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post('create')
  @UseGuards(AuthGuards)
  @UsePipes(new ValidationPipe())
  async create(
    @Req() request: IExpressRequestUser,
    @Body() createPostDto: PostDto,
  ): Promise<PostEntity> {
    return this.postService.create(createPostDto, request.user);
  }

  @Get('all')
  async findAll(@Query() query: any): Promise<PostDto[]> {
    if (!query.limit) {
      query.limit = '100';
    }
    return await this.postService.findAll(query);
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<PostDto> {
    return await this.postService.findOne(+id);
  }

  @Put(':id')
  @UseGuards(AuthGuards)
  @UsePipes(new ValidationPipe())
  async update(
    @Req() request: IExpressRequestUser,
    @Param('id') id: number,
    @Body() updatePostDto: PostDto,
  ): Promise<PostDto> {
    return await this.postService.update(+id, updatePostDto, request.user);
  }

  @Delete(':id')
  @UseGuards(AuthGuards)
  async remove(
    @Req() request: IExpressRequestUser,
    @Param('id')
    id: number,
  ): Promise<PostDto[]> {
    return await this.postService.remove(+id, request.user.id);
  }
}
