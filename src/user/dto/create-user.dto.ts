import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class CreateUserDto {
  @ApiProperty()
  @IsNotEmpty()
  readonly name: string;
  @IsNotEmpty()
  @ApiProperty()
  @IsEmail()
  readonly email: string;
  @ApiProperty()
  @IsNotEmpty()
  readonly password: string;
  @ApiProperty()
  readonly userImageUrl: string;
  @ApiProperty()
  readonly about: string;
  @ApiProperty()
  readonly isAdmin: boolean;
}
