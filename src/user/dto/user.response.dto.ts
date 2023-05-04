import { ApiProperty } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';

export class UserDtoRequest extends CreateUserDto {
  @ApiProperty()
  id: number;
  @ApiProperty()
  favoriteItems: [];
  @ApiProperty()
  basketItems: [];
  @ApiProperty()
  orderItems: [];
  @ApiProperty()
  reviews: [];
  @ApiProperty()
  posts: [];
  @ApiProperty()
  token: string;
}
