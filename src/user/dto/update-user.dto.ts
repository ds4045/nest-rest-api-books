import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class UpdateUserDto {
  @ApiProperty()
  id: number;
  @ApiProperty()
  @IsNotEmpty()
  name: string;
  @ApiProperty()
  userImageUrl: string;
  @ApiProperty()
  about: string;
  @ApiProperty()
  phone: string;
  @ApiProperty()
  address: string;
}
