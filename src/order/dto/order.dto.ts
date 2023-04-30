import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsNumber, Min } from 'class-validator';

export class OrderDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  id: number;
  @ApiProperty()
  @IsNotEmpty()
  userId: number;
  @ApiProperty()
  @IsNotEmpty()
  userName: string;
  @ApiProperty()
  @IsNotEmpty()
  @IsEmail()
  userEmail: string;
  @ApiProperty()
  @IsNotEmpty()
  userPhone: string;
  @ApiProperty()
  @IsNotEmpty()
  userAddress: string;
  @ApiProperty()
  @IsNotEmpty()
  itemId: number[];
  @ApiProperty()
  @IsNotEmpty()
  date: string;
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  totalPrice: number;
}
