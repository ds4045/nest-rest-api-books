import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsNumber, Max, Min } from 'class-validator';
import { PrimaryGeneratedColumn } from 'typeorm';

export class ReviewDto {
  @PrimaryGeneratedColumn()
  id: number;
  @ApiProperty()
  @IsNotEmpty()
  text: string;
  @ApiProperty()
  @IsNotEmpty()
  date: string;
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  @IsInt()
  @Min(1)
  @Max(5)
  rate: number;
}
