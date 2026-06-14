import { Repository, DataSource } from 'typeorm';
import { Order } from './entities/order.entity';
import { Product } from '../products/product.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderQueryDto } from './dto/order-query.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { Role } from '../common/enums/role.enum';
export declare class OrdersService {
    private readonly orderRepo;
    private readonly productRepo;
    private readonly dataSource;
    constructor(orderRepo: Repository<Order>, productRepo: Repository<Product>, dataSource: DataSource);
    create(dto: CreateOrderDto, userId: number): Promise<Order>;
    findAll(query: OrderQueryDto, userId: number, role: Role): Promise<{
        data: Order[];
        meta: {
            total: number;
            page: number;
            pageSize: number;
            totalPages: number;
        };
    }>;
    findOne(id: number, userId: number, role: Role): Promise<Order>;
    updateStatus(id: number, dto: UpdateOrderStatusDto): Promise<Order>;
    remove(id: number): Promise<void>;
}
