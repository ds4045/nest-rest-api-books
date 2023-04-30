import { IsInt } from 'class-validator';
import { Entity, Column, Unique, PrimaryColumn } from 'typeorm';

@Entity({ name: 'orders' })
@Unique(['userId', 'itemId', 'id'])
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
  @Column({ type: 'simple-array' })
  itemId: number[];
  @Column()
  date: string;
  @Column()
  totalPrice: number;
}
