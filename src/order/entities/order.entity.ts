import { Entity, Column, PrimaryGeneratedColumn, Unique } from 'typeorm';

@Entity({ name: 'orders' })
@Unique(['userId', 'itemId'])
export class OrderEntity {
  @PrimaryGeneratedColumn()
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
