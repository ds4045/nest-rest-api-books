import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  UsePipes,
  ValidationPipe,
  UseGuards,
  ForbiddenException,
  Query,
} from '@nestjs/common';
import { ItemService } from './item.service';
import { ItemDto } from './dto/item.dto';
import { ApiTags } from '@nestjs/swagger';
import { AdminOnly } from 'src/decorators/admin-only.decorator';
import { AuthGuards } from 'src/user/guards/auth.guard';

@Controller('item')
@ApiTags('item')
export class ItemController {
  constructor(private readonly itemService: ItemService) {}

  @Post('create')
  @UseGuards(AuthGuards)
  @UsePipes(new ValidationPipe())
  async create(
    @AdminOnly() isAdmin: boolean,
    @Body() createItemDto: ItemDto,
  ): Promise<ItemDto> {
    if (isAdmin) {
      return this.itemService.create(createItemDto);
    } else {
      throw new ForbiddenException(
        'Only admin users are allowed to access this resource',
      );
    }
  }

  @Get('all')
  async findAll(@Query() query: any): Promise<ItemDto[]> {
    return await this.itemService.findAll(query);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<ItemDto> {
    return await this.itemService.findOne(+id);
  }

  @Put(':id')
  @UseGuards(AuthGuards)
  @UsePipes(new ValidationPipe())
  async update(
    @AdminOnly() isAdmin: boolean,
    @Param('id') id: string,
    @Body() updateItemDto: ItemDto,
  ): Promise<ItemDto> {
    if (isAdmin) {
      return await this.itemService.update(+id, updateItemDto);
    } else {
      throw new ForbiddenException(
        'Only admin users are allowed to access this resource',
      );
    }
  }

  @Delete(':id')
  @UseGuards(AuthGuards)
  async remove(
    @AdminOnly() isAdmin: boolean,
    @Param('id') id: string,
  ): Promise<ItemDto[]> {
    if (isAdmin) {
      return await this.itemService.remove(+id);
    } else {
      throw new ForbiddenException(
        'Only admin users are allowed to access this resource',
      );
    }
  }
}