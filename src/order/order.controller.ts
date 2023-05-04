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
import { ApiHeader, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { BadRequestFilter } from 'src/common/request.filter';
import { UserEntity } from 'src/user/entities/user.entity';
import { OrderEntity } from './entities/order.entity';
import { AuthGuards } from 'src/user/guards/auth.guard';
import { UserDtoRequest } from 'src/user/dto/user.response.dto';

@ApiTags('order')
@UseFilters(BadRequestFilter)
@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  @UsePipes(new ValidationPipe())
  @ApiHeader({
    name: 'Authorization',
    description: 'JWT token',
  })
  @ApiOkResponse({ description: 'response', type: UserDtoRequest })
  @UseGuards(AuthGuards)
  async create(@Body() createOrderDto: OrderDto): Promise<UserEntity> {
    return await this.orderService.create(createOrderDto);
  }

  @Get(':userId')
  @UseGuards(AuthGuards)
  @ApiHeader({
    name: 'Authorization',
    description: 'JWT token',
  })
  @ApiOkResponse({ description: 'response', type: [OrderDto] })
  findAll(@Param('userId') userId: string): Promise<OrderEntity[]> {
    return this.orderService.findAll(+userId);
  }
}
