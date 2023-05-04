import { ApiProperty } from '@nestjs/swagger';
import { ItemDtoUpdate } from './itemUpdate.dto';

export class ItemResponseDto {
  @ApiProperty({ type: [ItemDtoUpdate] })
  items: ItemDtoUpdate[];
  @ApiProperty()
  totalItems: number;
  @ApiProperty()
  minPrice: number;
  @ApiProperty()
  maxPrice: number;
}
