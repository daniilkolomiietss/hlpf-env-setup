import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, OneToMany } from 'typeorm';
import { OrderStatus } from '../../common/enums/order-status.enum';
import { OrderItem } from './order-item.entity';
import { User } from '../../users/user.entity'; // Перевір шлях до своєї User Entity

@Entity({ name: 'orders' })
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'enum',
    enum: OrderStatus,
    default: OrderStatus.PENDING,
  })
  status: OrderStatus;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  totalPrice: number;

  @ManyToOne(() => User, { eager: false })
  user: User;

  @OneToMany(() => OrderItem, (item) => item.order, { eager: true, cascade: true })
  items: OrderItem[];

  @CreateDateColumn()
  createdAt: Date;
}