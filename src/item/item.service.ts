import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { ItemDto } from './dto/item.dto';
import { ItemEntity } from './entities/item.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ItemDtoUpdate } from './dto/itemUpdate.dto';
import { ItemResponseDto } from './dto/ItemResponse.dto';

@Injectable()
export class ItemService {
  constructor(
    @InjectRepository(ItemEntity)
    private readonly itemRepository: Repository<ItemEntity>,
  ) {}
  async create(createItemDto: ItemDto): Promise<ItemDto> {
    return await this.itemRepository.save(createItemDto);
  }

  async findAll(query: any): Promise<ItemResponseDto> {
    const {
      sortBy,
      sortOrder,
      limit,
      offset,
      priceFrom,
      priceTo,
      title,
      ...filters
    } = query;
    const qb = this.itemRepository
      .createQueryBuilder('item')
      .leftJoinAndSelect('item.reviews', 'itemReviews');

    const allowedSortByValues = [
      'title',
      'price',
      'genre',
      'category',
      'averageRate',
      'authorBook',
      'releaseDate',
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

    if (Number(offset) < 0) {
      throw new BadRequestException('Invalid value for offset');
    }

    if (priceFrom) {
      qb.andWhere(`item.price >= :priceFrom`, { priceFrom });
    }

    if (priceTo) {
      qb.andWhere(`item.price <= :priceTo`, { priceTo });
    }

    if (title) {
      qb.andWhere(`LOWER(item.title) LIKE LOWER(:title)`, {
        title: `%${title}%`,
      });
    }

    Object.keys(filters).forEach((key) => {
      qb.andWhere(`item.${key} = :${key}`, { [key]: filters[key] });
    });

    if (sortBy && sortOrder) {
      qb.orderBy(`item.${sortBy}`, sortOrder.toUpperCase());
    }

    if (limit) {
      qb.limit(limit);
    }

    if (offset) {
      qb.offset(offset);
    }

    const response = await qb.getMany();
    let totalItems = 0;
    let minPrice = Infinity;
    let maxPrice = -Infinity;

    response.forEach(({ price, discount }) => {
      totalItems++;
      const priceWithDiscount = discount ? discount : price;
      if (priceWithDiscount < minPrice) {
        minPrice = priceWithDiscount;
      }
      if (priceWithDiscount > maxPrice) {
        maxPrice = priceWithDiscount;
      }
    });

    return { items: response, totalItems, minPrice, maxPrice };
  }

  async findOne(id: number): Promise<ItemDtoUpdate> {
    if (!(await this.itemRepository.findOneBy({ id }))) {
      throw new HttpException('Item does not exist', HttpStatus.NOT_FOUND);
    }

    const qb = this.itemRepository
      .createQueryBuilder('item')
      .leftJoinAndSelect('item.reviews', 'itemReviews')
      .where('item.id = :id', { id });
    return await qb.getOne();
  }

  async update(
    id: number,
    updateItemDto: ItemDtoUpdate,
  ): Promise<ItemDtoUpdate> {
    if (!(await this.itemRepository.findOneBy({ id }))) {
      throw new HttpException('Item does not exist', HttpStatus.NOT_FOUND);
    }
    const item = await this.itemRepository.findOneBy({ id });
    Object.assign(item, updateItemDto);
    return await this.itemRepository.save(item);
  }

  async remove(id: number): Promise<ItemDtoUpdate[]> {
    if (!(await this.itemRepository.findOneBy({ id }))) {
      throw new HttpException('Item does not exist', HttpStatus.NOT_FOUND);
    }
    await this.itemRepository.delete(id);
    return await this.itemRepository.find();
  }
}
