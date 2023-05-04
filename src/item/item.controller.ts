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
  UseFilters,
} from '@nestjs/common';

import { ItemService } from './item.service';
import { ItemDto } from './dto/item.dto';
import { ApiHeader, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { AdminOnly } from 'src/decorators/admin-only.decorator';
import { AuthGuards } from 'src/user/guards/auth.guard';
import { BadRequestFilter } from 'src/common/request.filter';
import { ItemDtoUpdate } from './dto/itemUpdate.dto';
import { ItemResponseDto } from './dto/ItemResponse.dto';

@Controller('item')
@ApiTags('item')
@UseFilters(BadRequestFilter)
export class ItemController {
  constructor(private readonly itemService: ItemService) {}

  @Post('create')
  @UseGuards(AuthGuards)
  @UsePipes(new ValidationPipe())
  @ApiOkResponse({ description: 'response', type: ItemDto })
  @ApiHeader({
    name: 'Authorization',
    description: 'JWT token',
  })
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
  @ApiOkResponse({
    description: 'response',
    type: ItemResponseDto,
  })
  async findAll(@Query() query: any): Promise<ItemResponseDto> {
    if (!query.limit) {
      query.limit = '100';
    }
    return await this.itemService.findAll(query);
  }

  @Get(':id')
  @ApiOkResponse({ description: 'response', type: ItemDtoUpdate })
  async findOne(@Param('id') id: string): Promise<ItemDtoUpdate> {
    return await this.itemService.findOne(+id);
  }

  @Put(':id')
  @UseGuards(AuthGuards)
  @ApiOkResponse({ description: 'response', type: ItemDtoUpdate })
  @UsePipes(new ValidationPipe())
  @ApiHeader({
    name: 'Authorization',
    description: 'JWT token',
  })
  async update(
    @AdminOnly() isAdmin: boolean,
    @Param('id') id: string,
    @Body() updateItemDto: ItemDtoUpdate,
  ): Promise<ItemDtoUpdate> {
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
  @ApiOkResponse({ description: 'response', type: [ItemDtoUpdate] })
  @ApiHeader({
    name: 'Authorization',
    description: 'JWT token',
  })
  async remove(
    @AdminOnly() isAdmin: boolean,
    @Param('id') id: string,
  ): Promise<ItemDtoUpdate[]> {
    if (isAdmin) {
      return await this.itemService.remove(+id);
    } else {
      throw new ForbiddenException(
        'Only admin users are allowed to access this resource',
      );
    }
  }
}
