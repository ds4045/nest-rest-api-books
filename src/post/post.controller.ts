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
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { PostService } from './post.service';
import { IExpressRequestUser } from 'src/user/user.type';
import { BadRequestFilter } from 'src/common/request.filter';
import { PostUpdateDto } from './dto/postUpdate.dto';
import { PostEntity } from './entities/post.entity';
import { PostResponseDto } from './dto/postResponse.dto';

@Controller('post')
@ApiTags('post')
@UseFilters(BadRequestFilter)
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post('create')
  @UseGuards(AuthGuards)
  @UsePipes(new ValidationPipe())
  @ApiOkResponse({ description: 'response', type: PostDto })
  async create(
    @Req() request: IExpressRequestUser,
    @Body() createPostDto: PostDto,
  ): Promise<PostEntity[]> {
    return this.postService.create(createPostDto, request.user);
  }

  @Get('all')
  @ApiOkResponse({ description: 'response', type: [PostUpdateDto] })
  async findAll(@Query() query: any): Promise<PostUpdateDto[]> {
    if (!query.limit) {
      query.limit = '100';
    }
    return await this.postService.findAll(query);
  }

  @Get(':id')
  @ApiOkResponse({ description: 'response', type: PostUpdateDto })
  async findOne(@Param('id') id: number): Promise<PostUpdateDto> {
    return await this.postService.findOne(+id);
  }

  @Put(':id')
  @UseGuards(AuthGuards)
  @ApiOkResponse({ description: 'response', type: [PostResponseDto] })
  @UsePipes(new ValidationPipe())
  async update(
    @Req() request: IExpressRequestUser,
    @Param('id') id: number,
    @Body() updatePostDto: PostUpdateDto,
  ): Promise<PostEntity[]> {
    return await this.postService.update(+id, updatePostDto, request.user);
  }

  @Delete(':id')
  @UseGuards(AuthGuards)
  @ApiOkResponse({ description: 'response', type: [PostResponseDto] })
  async remove(
    @Req() request: IExpressRequestUser,
    @Param('id')
    id: number,
  ): Promise<PostEntity[]> {
    return await this.postService.remove(+id, request.user.id);
  }
}
