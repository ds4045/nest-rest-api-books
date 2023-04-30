import { IsInt } from 'class-validator';
import { Entity, Column, Unique } from 'typeorm';

@Entity({ name: 'orders' })
@Unique(['userId', 'itemId,id'])
export class OrderEntity {
  @Column()
  @IsInt()
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
  @Column({
    type: 'text',
    transformer: {
      to: (value: number[]) => JSON.stringify(value),
      from: (value: string) => JSON.parse(value),
    },
  })
  itemId: number[];
  @Column()
  date: string;
  @Column()
  totalPrice: number;
}
