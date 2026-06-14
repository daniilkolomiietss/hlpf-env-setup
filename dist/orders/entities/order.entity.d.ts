import { OrderStatus } from '../../common/enums/order-status.enum';
import { OrderItem } from './order-item.entity';
import { User } from '../../users/user.entity';
export declare class Order {
    id: number;
    status: OrderStatus;
    totalPrice: number;
    user: User;
    items: OrderItem[];
    createdAt: Date;
}
