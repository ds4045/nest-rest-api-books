import { ApiProperty } from '@nestjs/swagger';
import { PostDto } from './post.dto';
import { IsNumber } from 'class-validator';

export class PostUpdateDto extends PostDto {
  @ApiProperty()
  @IsNumber()
  id: number;
}
