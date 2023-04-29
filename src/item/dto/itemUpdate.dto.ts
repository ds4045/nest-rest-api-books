import { ApiProperty } from '@nestjs/swagger';
import { ItemDto } from './item.dto';
import { IsNumber } from 'class-validator';

export class ItemDtoUpdate extends ItemDto {
  @ApiProperty()
  @IsNumber()
  id: number;
}
