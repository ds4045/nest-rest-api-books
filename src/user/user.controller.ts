import { UserService } from './user.service';
import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';

import { AuthGuards } from './guards/auth.guard';
import { ApiTags } from '@nestjs/swagger';
import { LoginUserDto } from './dto/login-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { IExpressRequestUser, IUserRequest } from './user.type';

@Controller('user')
@ApiTags('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Post('register')
  @UsePipes(new ValidationPipe())
  async createUser(
    @Body() createUserDto: CreateUserDto,
  ): Promise<IUserRequest> {
    const user = await this.userService.createUser(createUserDto);
    return this.userService.buildUserResponse(user);
  }
  @Post('login')
  @UsePipes(new ValidationPipe())
  async login(@Body() loginUserDto: LoginUserDto): Promise<IUserRequest> {
    const user = await this.userService.login(loginUserDto);
    return this.userService.buildUserResponse(user);
  }
  @Get('current')
  @UseGuards(AuthGuards)
  async getCurrentUser(
    @Req() request: IExpressRequestUser,
  ): Promise<IUserRequest> {
    return this.userService.buildUserResponse(request.user);
  }
  @Put('update')
  @UsePipes(new ValidationPipe())
  @UseGuards(AuthGuards)
  async updateCurrentUser(
    @Req() request: IExpressRequestUser,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<IUserRequest> {
    const user = await this.userService.updateUser(
      request.user.id,
      updateUserDto,
    );
    return this.userService.buildUserResponse(user);
  }
  @Post('favorites/:itemId')
  @UseGuards(AuthGuards)
  async addFavorite(
    @Req() request: IExpressRequestUser,
    @Param('itemId') itemId: number,
  ) {
    return this.userService.updateItemField(
      'favoriteItems',
      request.user.id,
      itemId,
      true,
    );
  }
  @Post('favorites-remove/:itemId')
  @UseGuards(AuthGuards)
  async removeFavorite(
    @Req() request: IExpressRequestUser,
    @Param('itemId') itemId: number,
  ) {
    return this.userService.updateItemField(
      'basketItems',
      request.user.id,
      itemId,
      false,
    );
  }

  @Post('basket/:itemId')
  @UseGuards(AuthGuards)
  async addBasket(
    @Req() request: IExpressRequestUser,
    @Param('itemId') itemId: number,
  ) {
    return this.userService.updateItemField(
      'basketItems',
      request.user.id,
      itemId,
      true,
    );
  }
  @Post('basket-remove/:itemId')
  @UseGuards(AuthGuards)
  async removeBasket(
    @Req() request: IExpressRequestUser,
    @Param('itemId') itemId: number,
  ) {
    return this.userService.updateItemField(
      'basketItems',
      request.user.id,
      itemId,
      false,
    );
  }

  @Post('order/:itemId')
  @UseGuards(AuthGuards)
  async addOrder(
    @Req() request: IExpressRequestUser,
    @Param('itemId') itemId: number,
  ) {
    return this.userService.updateItemField(
      'orderItems',
      request.user.id,
      itemId,
      true,
    );
  }

  @Post('order-remove/:itemId')
  @UseGuards(AuthGuards)
  async removeOrder(
    @Req() request: IExpressRequestUser,
    @Param('itemId') itemId: number,
  ) {
    return this.userService.updateItemField(
      'orderItems',
      request.user.id,
      itemId,
      false,
    );
  }
}
