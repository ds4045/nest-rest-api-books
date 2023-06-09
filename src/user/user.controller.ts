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
import { ApiHeader, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { LoginUserDto } from './dto/login-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { IExpressRequestUser, IUserRequest } from './user.type';
import { UserDtoRequest } from './dto/user.response.dto';

@Controller('user')
@ApiTags('user')
@ApiOkResponse({ description: 'response', type: UserDtoRequest })
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
    return this.userService.buildUserResponse(
      request.user,
      request.headers.authorization,
    );
  }
  @Put('update')
  @UsePipes(new ValidationPipe())
  @UseGuards(AuthGuards)
  @ApiHeader({
    name: 'Authorization',
    description: 'JWT token',
  })
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
  @ApiHeader({
    name: 'Authorization',
    description: 'JWT token',
  })
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
  @ApiHeader({
    name: 'Authorization',
    description: 'JWT token',
  })
  async removeFavorite(
    @Req() request: IExpressRequestUser,
    @Param('itemId') itemId: number,
  ) {
    return this.userService.updateItemField(
      'favoriteItems',
      request.user.id,
      itemId,
      false,
    );
  }

  @Post('basket/:itemId')
  @UseGuards(AuthGuards)
  @ApiHeader({
    name: 'Authorization',
    description: 'JWT token',
  })
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
  @ApiHeader({
    name: 'Authorization',
    description: 'JWT token',
  })
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
  @ApiHeader({
    name: 'Authorization',
    description: 'JWT token',
  })
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
  @ApiHeader({
    name: 'Authorization',
    description: 'JWT token',
  })
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
