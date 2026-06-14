import { Injectable, BadRequestException, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Order } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { Product } from '../products/product.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderQueryDto } from './dto/order-query.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { Role } from '../common/enums/role.enum';
import { OrderStatus } from '../common/enums/order-status.enum';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepo: Repository<Order>,
    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,
    private readonly dataSource: DataSource,
  ) {}

  async create(dto: CreateOrderDto, userId: number): Promise<Order> {
    const qr = this.dataSource.createQueryRunner();
    await qr.connect();
    await qr.startTransaction();

    try {
      let totalPrice = 0;
      const orderItems: OrderItem[] = [];

      for (const itemDto of dto.items) {
        const product = await qr.manager.findOne(Product, {
          where: { id: itemDto.productId },
        });

        if (!product) {
          throw new NotFoundException(`Продукт з ID ${itemDto.productId} не знайдено`);
        }

        if (product.stock < itemDto.quantity) {
          throw new BadRequestException(
            `Недостатньо товару "${product.name}" на складі. Доступно: ${product.stock}, запитано: ${itemDto.quantity}`,
          );
        }

        product.stock -= itemDto.quantity;
        await qr.manager.save(Product, product);

        const pricePerUnit = parseFloat(product.price as any);
        totalPrice += pricePerUnit * itemDto.quantity;

        const orderItem = new OrderItem();
        orderItem.product = product;
        orderItem.quantity = itemDto.quantity;
        orderItem.price = product.price.toString();

        orderItems.push(orderItem);
      }

      const order = new Order();
      order.user = { id: userId } as any; 
      order.status = OrderStatus.PENDING;
      order.totalPrice = totalPrice;
      order.items = orderItems;

      const savedOrder = await qr.manager.save(Order, order);

      await qr.commitTransaction();
      return savedOrder;

    } catch (error) {
      await qr.rollbackTransaction();
      throw error;
    } finally {
      await qr.release();
    }
  }

  async findAll(query: OrderQueryDto, userId: number, role: Role) {
    const { page = 1, pageSize = 10, status } = query;
    const skip = (page - 1) * pageSize;

    const queryBuilder = this.orderRepo.createQueryBuilder('order')
      .leftJoinAndSelect('order.items', 'items')
      .leftJoinAndSelect('items.product', 'product')
      .leftJoin('order.user', 'user')
      .addSelect(['user.id', 'user.email']); 

    if (role !== Role.ADMIN) {
      queryBuilder.andWhere('user.id = :userId', { userId });
    }

    if (status) {
      queryBuilder.andWhere('order.status = :status', { status });
    }

    queryBuilder.orderBy('order.createdAt', 'DESC');

    queryBuilder.skip(skip).take(pageSize);

    const [data, total] = await queryBuilder.getManyAndCount();

    return {
      data,
      meta: {
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize),
      },
    };
  }

  async findOne(id: number, userId: number, role: Role): Promise<Order> {
    const order = await this.orderRepo.findOne({
      where: { id },
      relations: ['items', 'items.product', 'user'],
    });

    if (!order) {
      throw new NotFoundException(`Замовлення з ID ${id} не знайдено`);
    }

    if (role !== Role.ADMIN && order.user.id !== userId) {
      throw new ForbiddenException('У вас немає доступу до цього замовлення');
    }

    const { password, ...safeUser } = order.user as any;
    order.user = safeUser;

    return order;
  }
  async updateStatus(id: number, dto: UpdateOrderStatusDto): Promise<Order> {
    const order = await this.orderRepo.findOne({
      where: { id },
      relations: ['items', 'items.product'],
    });

    if (!order) {
      throw new NotFoundException(`Замовлення з ID ${id} не знайдено`);
    }

    order.status = dto.status;

    return await this.orderRepo.save(order);
  }

  async remove(id: number): Promise<void> {
    const order = await this.orderRepo.findOne({ where: { id } });
    
    if (!order) {
      throw new NotFoundException(`Замовлення з ID ${id} не знайдено`);
    }

    await this.orderRepo.remove(order);
  }
}