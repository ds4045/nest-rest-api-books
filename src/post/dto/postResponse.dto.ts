import { ApiProperty } from '@nestjs/swagger';
import { PostUpdateDto } from './postUpdate.dto';

export class PostResponseDto extends PostUpdateDto {
  @ApiProperty()
  authorName: string;
  @ApiProperty()
  authorId: number;
}
