import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty } from 'class-validator';

export class ItemDto {
  @ApiProperty()
  @IsBoolean()
  inStock: boolean;
  @ApiProperty()
  @IsNotEmpty()
  title: string;
  @ApiProperty()
  @IsNotEmpty()
  itemImageUrl: string;
  @ApiProperty()
  @IsNotEmpty()
  description: string;
  @ApiProperty()
  @IsNotEmpty()
  price: number;
  @ApiProperty()
  @IsNotEmpty()
  genre: string;
  @ApiProperty()
  @IsNotEmpty()
  authorBook: string;
  @ApiProperty()
  @IsNotEmpty()
  releaseDate: string;
}
