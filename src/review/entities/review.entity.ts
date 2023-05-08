import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'reviews' })
export class ReviewEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  text: string;
  @Column()
  authorId: number;
  @Column()
  itemId: number;
  @Column()
  authorName: string;
  @Column()
  date: string;
  @Column()
  rate: number;
  @Column()
  itemImageUrl: string;
  @Column()
  userImageUrl: string;
  @Column()
  itemTitle: string;
}
