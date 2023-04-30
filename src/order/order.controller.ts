import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseFilters,
  ValidationPipe,
  UsePipes,
  UseGuards,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderDto } from './dto/order.dto';
import { ApiTags } from '@nestjs/swagger';
import { BadRequestFilter } from 'src/common/request.filter';
import { UserEntity } from 'src/user/entities/user.entity';
import { OrderEntity } from './entities/order.entity';
import { AuthGuards } from 'src/user/guards/auth.guard';

@ApiTags('order')
// @UseFilters(BadRequestFilter)
@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  @UsePipes(new ValidationPipe())
  @UseGuards(AuthGuards)
  async create(@Body() createOrderDto: OrderDto): Promise<UserEntity> {
    return await this.orderService.create(createOrderDto);
  }

  @Get(':userId')
  @UseGuards(AuthGuards)
  findAll(@Param('userId') userId: string): Promise<OrderEntity[]> {
    return this.orderService.findAll(+userId);
  }
}
