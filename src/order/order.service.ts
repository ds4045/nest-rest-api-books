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
    const user = await this.userRepository.findOneBy({ id: userId });
    const orders = await this.orderRepository.find();
    const newOrder = { ...new OrderDto(), ...createOrderDto };
    orders.push(newOrder);
    user.orderItems.push(newOrder);
    await this.orderRepository.save(orders);
    return await this.userRepository.save(user);
  }

  async findAll(userId: number): Promise<OrderEntity[]> {
    const user = await this.userRepository.findOneBy({ id: userId });
    return user.orderItems;
  }
}
