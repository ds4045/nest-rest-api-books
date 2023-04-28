import {
  BeforeInsert,
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { hash } from 'bcrypt';
import { ItemEntity } from 'src/item/entities/item.entity';
import { ReviewEntity } from 'src/review/entities/review.entity';
import { PostEntity } from 'src/post/entities/post.entity';
@Entity({ name: 'users' })
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  isAdmin: boolean;
  @BeforeInsert()
  async hashPassword() {
    this.password = await hash(this.password, 10);
  }
  @Column()
  password: string;
  @Column()
  email: string;
  @Column()
  userImageUrl: string;
  @Column()
  name: string;
  @Column()
  about: string;
  @ManyToMany(() => ItemEntity)
  @JoinTable()
  favoriteItems: ItemEntity[];
  @ManyToMany(() => ItemEntity)
  @JoinTable()
  basketItems: ItemEntity[];
  @ManyToMany(() => ItemEntity)
  @JoinTable()
  orderItems: ItemEntity[];
  @ManyToMany(() => ReviewEntity)
  @JoinTable()
  reviews: ReviewEntity[];
  @ManyToMany(() => PostEntity)
  @JoinTable()
  posts: PostEntity[];
}
