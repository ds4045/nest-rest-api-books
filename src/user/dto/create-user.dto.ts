import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class CreateUserDto {
  @ApiProperty()
  @IsNotEmpty()
  name: string;
  @IsNotEmpty()
  @ApiProperty()
  @IsEmail()
  email: string;
  @ApiProperty()
  @IsNotEmpty()
  password: string;
  @ApiProperty()
  userImageUrl: string;
  @ApiProperty()
  about: string;
  @ApiProperty()
  readonly isAdmin: boolean;
  @ApiProperty()
  phone: string;
  @ApiProperty()
  address: string;
}
