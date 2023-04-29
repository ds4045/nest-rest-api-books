import { ReviewEntity } from 'src/review/entities/review.entity';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'items' })
export class ItemEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  inStock: boolean;
  @Column()
  typeOfCover: string;
  @Column()
  title: string;
  @Column()
  itemImageUrl: string;
  @Column()
  description: string;
  @Column()
  price: number;
  @Column()
  category: string;
  @Column()
  publisher: string;
  @Column()
  genre: string;
  @Column()
  pagesCount: number;
  @Column()
  discount: number;
  @Column()
  authorBook: string;
  @Column()
  releaseDate: string;
  @ManyToMany(() => ReviewEntity)
  @JoinTable()
  reviews: ReviewEntity[];
}
