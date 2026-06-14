"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrdersService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const order_entity_1 = require("./entities/order.entity");
const order_item_entity_1 = require("./entities/order-item.entity");
const product_entity_1 = require("../products/product.entity");
const role_enum_1 = require("../common/enums/role.enum");
const order_status_enum_1 = require("../common/enums/order-status.enum");
let OrdersService = class OrdersService {
    orderRepo;
    productRepo;
    dataSource;
    constructor(orderRepo, productRepo, dataSource) {
        this.orderRepo = orderRepo;
        this.productRepo = productRepo;
        this.dataSource = dataSource;
    }
    async create(dto, userId) {
        const qr = this.dataSource.createQueryRunner();
        await qr.connect();
        await qr.startTransaction();
        try {
            let totalPrice = 0;
            const orderItems = [];
            for (const itemDto of dto.items) {
                const product = await qr.manager.findOne(product_entity_1.Product, {
                    where: { id: itemDto.productId },
                });
                if (!product) {
                    throw new common_1.NotFoundException(`Продукт з ID ${itemDto.productId} не знайдено`);
                }
                if (product.stock < itemDto.quantity) {
                    throw new common_1.BadRequestException(`Недостатньо товару "${product.name}" на складі. Доступно: ${product.stock}, запитано: ${itemDto.quantity}`);
                }
                product.stock -= itemDto.quantity;
                await qr.manager.save(product_entity_1.Product, product);
                const pricePerUnit = parseFloat(product.price);
                totalPrice += pricePerUnit * itemDto.quantity;
                const orderItem = new order_item_entity_1.OrderItem();
                orderItem.product = product;
                orderItem.quantity = itemDto.quantity;
                orderItem.price = product.price.toString();
                orderItems.push(orderItem);
            }
            const order = new order_entity_1.Order();
            order.user = { id: userId };
            order.status = order_status_enum_1.OrderStatus.PENDING;
            order.totalPrice = totalPrice;
            order.items = orderItems;
            const savedOrder = await qr.manager.save(order_entity_1.Order, order);
            await qr.commitTransaction();
            return savedOrder;
        }
        catch (error) {
            await qr.rollbackTransaction();
            throw error;
        }
        finally {
            await qr.release();
        }
    }
    async findAll(query, userId, role) {
        const { page = 1, pageSize = 10, status } = query;
        const skip = (page - 1) * pageSize;
        const queryBuilder = this.orderRepo.createQueryBuilder('order')
            .leftJoinAndSelect('order.items', 'items')
            .leftJoinAndSelect('items.product', 'product')
            .leftJoin('order.user', 'user')
            .addSelect(['user.id', 'user.email']);
        if (role !== role_enum_1.Role.ADMIN) {
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
    async findOne(id, userId, role) {
        const order = await this.orderRepo.findOne({
            where: { id },
            relations: ['items', 'items.product', 'user'],
        });
        if (!order) {
            throw new common_1.NotFoundException(`Замовлення з ID ${id} не знайдено`);
        }
        if (role !== role_enum_1.Role.ADMIN && order.user.id !== userId) {
            throw new common_1.ForbiddenException('У вас немає доступу до цього замовлення');
        }
        const { password, ...safeUser } = order.user;
        order.user = safeUser;
        return order;
    }
    async updateStatus(id, dto) {
        const order = await this.orderRepo.findOne({
            where: { id },
            relations: ['items', 'items.product'],
        });
        if (!order) {
            throw new common_1.NotFoundException(`Замовлення з ID ${id} не знайдено`);
        }
        order.status = dto.status;
        return await this.orderRepo.save(order);
    }
    async remove(id) {
        const order = await this.orderRepo.findOne({ where: { id } });
        if (!order) {
            throw new common_1.NotFoundException(`Замовлення з ID ${id} не знайдено`);
        }
        await this.orderRepo.remove(order);
    }
};
exports.OrdersService = OrdersService;
exports.OrdersService = OrdersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(order_entity_1.Order)),
    __param(1, (0, typeorm_1.InjectRepository)(product_entity_1.Product)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.DataSource])
], OrdersService);
//# sourceMappingURL=orders.service.js.map