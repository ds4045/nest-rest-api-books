import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'posts' })
export class PostEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  description: string;
  @Column()
  postImageUrl: string;
  @Column()
  title: string;
  @Column()
  date: string;
  @Column()
  authorName: string;
  @Column()
  authorId: number;
  @Column()
  likes: number;
}
