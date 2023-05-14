import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { sign } from 'jsonwebtoken';
import { compare } from 'bcrypt';
import { UserEntity } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

import { IUserRequest } from './user.type';
import { ItemEntity } from 'src/item/entities/item.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(ItemEntity)
    private readonly itemRepository: Repository<ItemEntity>,
  ) {}
  async createUser(createUserDto: CreateUserDto): Promise<UserEntity> {
    const userByEmail = await this.userRepository.findOneBy({
      email: createUserDto.email,
    });
    if (userByEmail) {
      throw new HttpException(
        'Email are taken',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
    const newUser = new UserEntity();
    Object.assign(newUser, createUserDto);
    return await this.userRepository.save(newUser);
  }
  generateJwt(user: UserEntity): string {
    return sign(
      {
        id: user.id,
        name: user.name,
        email: user.email,
      },
      process.env.JWT_SECRET,
    );
  }
  async buildUserResponse(
    user: UserEntity,
    token?: string,
  ): Promise<IUserRequest> {
    const userId = user.id;
    const currentUser = await this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect(`user.favoriteItems`, 'favoriteItems')
      .leftJoinAndSelect(`user.basketItems`, 'basketItems')
      .leftJoinAndSelect(`user.orderItems`, 'orderItems')
      .leftJoinAndSelect(`user.reviews`, 'itemReviews')
      .leftJoinAndSelect(`user.posts`, 'userPosts')
      .where('user.id = :userId', { userId })
      .getOne();
    return {
      ...currentUser,
      token: token ? token : this.generateJwt(user),
    };
  }
  async login(loginUserDto: LoginUserDto): Promise<UserEntity> {
    const findUser = await this.userRepository
      .createQueryBuilder('user')
      .addSelect('user.password')
      .where('user.email = :email', { email: loginUserDto.email })
      .getOne();
    if (!findUser) {
      throw new HttpException(
        'Credentials are not available',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
    const isPasswordCorrect = await compare(
      loginUserDto.password,
      findUser.password,
    );
    if (!isPasswordCorrect) {
      throw new HttpException(
        'Credentials are not available',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
    delete findUser.password;
    return findUser;
  }
  async findById(id: number): Promise<UserEntity> {
    if (!(await this.userRepository.findOneBy({ id }))) {
      throw new HttpException('Data does not exist', HttpStatus.NOT_FOUND);
    }
    return await this.userRepository.findOneBy({ id });
  }
  async updateUser(
    userId: number,
    updateUserDto: UpdateUserDto,
  ): Promise<UserEntity> {
    const user = await this.findById(userId);
    if (!user) {
      throw new HttpException('Data does not exist', HttpStatus.NOT_FOUND);
    }
    Object.assign(user, updateUserDto);
    return await this.userRepository.save(user);
  }

  async updateItemField(
    entityName: string,
    userId: number,
    itemId: number,
    add: boolean,
  ) {
    const item = await this.itemRepository.findOneBy({ id: itemId });
    const user = await this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect(`user.${entityName}`, `${entityName}`)
      .where('user.id = :userId', { userId })
      .getOne();
    if (!item || !user || !userId || !itemId) {
      throw new HttpException('Data does not exist', HttpStatus.NOT_FOUND);
    }
    const isItemAlreadyPicked = user[entityName].find(
      (el: ItemEntity) => el.id === item.id,
    );
    if (isItemAlreadyPicked && add) {
      throw new HttpException(
        `Item with id ${item.id} is already picked`,
        HttpStatus.CONFLICT,
      );
    }
    if (!isItemAlreadyPicked && !add) {
      throw new HttpException(
        `Item with id ${item.id} is not found`,
        HttpStatus.NOT_FOUND,
      );
    }
    if (add) {
      user[entityName].push(item);
    } else {
      const itemIndex = user[entityName].findIndex(
        (i: ItemEntity) => i.id === item.id,
      );
      user[entityName].splice(itemIndex, 1);
    }
    return await this.userRepository.save(user);
  }
}
