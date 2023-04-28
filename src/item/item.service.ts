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

@Injectable()
export class ItemService {
  constructor(
    @InjectRepository(ItemEntity)
    private readonly itemRepository: Repository<ItemEntity>,
  ) {}
  async create(createItemDto: ItemDto): Promise<ItemDto> {
    return await this.itemRepository.save(createItemDto);
  }

  async findAll(query: any): Promise<ItemDto[]> {
    const { sortBy, sortOrder, limit, offset, ...filters } = query;
    const qb = this.itemRepository
      .createQueryBuilder('item')
      .leftJoinAndSelect('item.reviews', 'itemReviews');
    const allowedSortByValues = [
      'title',
      'price',
      'genre',
      'category',
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
    if ((offset && isNaN(offset)) || Number(offset) < 1) {
      throw new BadRequestException('Invalid value for offset');
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
    return await qb.getMany();
  }

  async findOne(id: number): Promise<ItemDto> {
    if (!(await this.itemRepository.findOneBy({ id }))) {
      throw new HttpException('Item does not exist', HttpStatus.NOT_FOUND);
    }
    return await this.itemRepository.findOneBy({ id });
  }

  async update(id: number, updateItemDto: ItemDto): Promise<ItemDto> {
    if (!(await this.itemRepository.findOneBy({ id }))) {
      throw new HttpException('Item does not exist', HttpStatus.NOT_FOUND);
    }
    const item = await this.itemRepository.findOneBy({ id });
    Object.assign(item, updateItemDto);
    return await this.itemRepository.save(item);
  }

  async remove(id: number): Promise<ItemDto[]> {
    if (!(await this.itemRepository.findOneBy({ id }))) {
      throw new HttpException('Item does not exist', HttpStatus.NOT_FOUND);
    }
    await this.itemRepository.delete(id);
    return await this.itemRepository.find();
  }
}
