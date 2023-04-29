import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsInt, IsNotEmpty, Min } from 'class-validator';

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
  category: string;
  @ApiProperty()
  @IsNotEmpty()
  publisher: string;
  @ApiProperty()
  @IsNotEmpty()
  typeOfCover: string;
  @ApiProperty()
  @IsNotEmpty()
  @IsInt()
  @Min(0)
  discount: number;
  @ApiProperty()
  @IsNotEmpty()
  @IsInt()
  @Min(1)
  pagesCount: number;
  @ApiProperty()
  @IsNotEmpty()
  @IsInt()
  @Min(1)
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
