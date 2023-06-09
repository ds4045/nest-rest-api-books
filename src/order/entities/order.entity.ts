import { IsInt } from 'class-validator';
import { Entity, Column, Unique, PrimaryColumn } from 'typeorm';

@Entity({ name: 'orders' })
@Unique(['userId', 'id'])
export class OrderEntity {
  @IsInt()
  @PrimaryColumn()
  id: number;
  @Column()
  userId: number;
  @Column()
  userName: string;
  @Column()
  userEmail: string;
  @Column()
  userPhone: string;
  @Column()
  userAddress: string;
  @Column()
  items: string;
  @Column()
  date: string;
  @Column()
  totalPrice: number;
}
export type Order = {
  imageUrl: string;
  price: number;
  count: number;
  title: string;
};
