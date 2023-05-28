import { Injectable } from '@nestjs/common';
import { OrderDto } from './dto/order.dto';
import { OrderEntity } from './entities/order.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from 'src/user/entities/user.entity';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(OrderEntity)
    private readonly orderRepository: Repository<OrderEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}
  async create(createOrderDto: OrderDto): Promise<UserEntity> {
    const userId = createOrderDto.userId;
    const user = await this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.orderItems', 'userOrders')
      .where('user.id = :userId', { userId })
      .getOne();
    const newOrder = { ...createOrderDto };
    const savedOrder = await this.orderRepository.save(newOrder);

    user.orderItems.push(savedOrder);
    await this.userRepository.save(user);

    return user;
  }

  async findAll(userId: number): Promise<OrderEntity[]> {
    const user = await this.userRepository.findOneBy({ id: userId });
    return user.orderItems;
  }
}
