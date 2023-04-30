import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PostEntity } from './entities/post.entity';
import { PostDto } from './dto/post.dto';
import { UserEntity } from 'src/user/entities/user.entity';
import { ReviewEntity } from 'src/review/entities/review.entity';
import { PostUpdateDto } from './dto/postUpdate.dto';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(PostEntity)
    private readonly postRepository: Repository<PostEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}
  async create(createPostDto: PostDto, user: UserEntity): Promise<UserEntity> {
    const userId = user.id;
    const ownerUser = await this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.posts', 'userPosts')
      .where('user.id = :userId', { userId })
      .getOne();

    const newPost = {
      ...new ReviewEntity(),
      ...createPostDto,
      authorId: user.id,
      authorName: user.name,
    };
    await this.postRepository.save(newPost);
    ownerUser.posts.push(newPost);
    return await this.userRepository.save(ownerUser);
  }

  async findAll(query: any): Promise<PostUpdateDto[]> {
    const { sortBy, sortOrder, limit, offset, ...filters } = query;
    const qb = this.postRepository.createQueryBuilder('post');
    const allowedSortByValues = [
      'title',
      'date',
      'authorName',
      'likes',
      'authorId',
    ];
    if (sortBy && !allowedSortByValues.includes(sortBy)) {
      throw new BadRequestException('Invalid value for sortBy');
    }
    if (
      sortOrder &&
      sortOrder.toUpperCase() !== 'ASC' &&
      sortOrder.toUpperCase() !== 'DESC'
    ) {
      throw new BadRequestException('Invalid value for sortOrder');
    }
    if ((limit && isNaN(limit)) || Number(limit) < 1) {
      throw new BadRequestException('Invalid value for limit');
    }
    if ((offset && isNaN(offset)) || Number(offset) < 1) {
      throw new BadRequestException('Invalid value for offset');
    }
    Object.keys(filters).forEach((key) => {
      qb.andWhere(`post.${key} = :${key}`, { [key]: filters[key] });
    });
    if (sortBy && sortOrder) {
      qb.orderBy(`post.${sortBy}`, sortOrder.toUpperCase());
    }
    if (limit) {
      qb.limit(limit);
    }
    if (offset) {
      qb.offset(offset);
    }
    return await qb.getMany();
  }

  async findOne(id: number): Promise<PostUpdateDto> {
    if (!(await this.postRepository.findOneBy({ id }))) {
      throw new HttpException('Post does not exist', HttpStatus.NOT_FOUND);
    }
    return await this.postRepository.findOneBy({ id });
  }

  async update(
    id: number,
    updatePostDto: PostUpdateDto,
    user: UserEntity,
  ): Promise<UserEntity> {
    const userId = user.id;
    const ownerUser = await this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.posts', 'userPosts')
      .where('user.id = :userId', { userId })
      .getOne();
    if (!(await this.postRepository.findOneBy({ id }))) {
      throw new HttpException('Post does not exist', HttpStatus.NOT_FOUND);
    }
    const post = await this.postRepository.findOneBy({ id });
    Object.assign(post, updatePostDto);
    await this.postRepository.save(post);
    ownerUser.posts = ownerUser.posts.map((p) => (p.id === id ? post : p));
    return await this.userRepository.save(ownerUser);
  }

  async remove(postId: number, userId: number): Promise<UserEntity> {
    const ownerUser = await this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.posts', 'userPosts')
      .where('user.id = :userId', { userId })
      .getOne();
    if (!(await this.postRepository.findOneBy({ id: postId }))) {
      throw new HttpException('Post does not exist', HttpStatus.NOT_FOUND);
    }
    const currentPost = await this.postRepository.findOneBy({ id: postId });
    if (currentPost?.authorId !== userId) {
      throw new HttpException('Post does not exist', HttpStatus.FORBIDDEN);
    } else {
      await this.postRepository.delete(postId);
      ownerUser.posts = ownerUser.posts.filter((p) => p.id !== postId);
      return await this.userRepository.save(ownerUser);
    }
  }
}
