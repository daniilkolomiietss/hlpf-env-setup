import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductQueryDto } from './dto/product-query.dto';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) {}

  private async clearProductsCache(): Promise<void> {
    try {
      // Обходимо типізацію через any, щоб дістатися до внутрішнього Redis-клієнта або масиву сховищ
      const manager = this.cacheManager as any;
      
      // Намагаємося отримати метод keys залежно від структури (store чи stores)
      let keys: string[] = [];
      
      if (manager.store && typeof manager.store.keys === 'function') {
        keys = await manager.store.keys('products:*');
      } else if (manager.stores && manager.stores[0] && typeof manager.stores[0].keys === 'function') {
        keys = await manager.stores[0].keys('products:*');
      } else if (typeof manager.keys === 'function') {
        keys = await manager.keys('products:*');
      }

      if (keys && keys.length > 0) {
        await Promise.all(
          keys.map((key) => this.cacheManager.del(key)),
        );
        console.log(`[Redis] Інвалідовано ключів: ${keys.length}`);
      }
    } catch (error) {
      console.error('[Redis Error] Не вдалося очистити кеш:', error);
    }
  }


  async findAll(query: ProductQueryDto) {
    // 1. Створюємо унікальний ключ кешу на основі параметрів фільтрації, пагінації та сортування
    const pageNum = query.page ? Number(query.page) : 1;
    const pageSizeNum = query.pageSize ? Number(query.pageSize) : 10;
    
    // Формуємо передбачуваний очищений об'єкт для ключа
    const cleanQuery = {
      ...query,
      page: pageNum,
      pageSize: pageSizeNum
    };
    const cacheKey = `products:${JSON.stringify(query)}`;

    // 2. Перевіряємо, чи є вже готові дані в Redis кеші
    const cached = await this.cacheManager.get(cacheKey);
    if (cached) {
      return cached; // Якщо є — миттєво повертаємо дані без звернення до Postgres
    }

    // 3. Якщо в кеші порожньо — дістаємо дані з бази даних (ваш оригінальний код)
    const {
      page = 1,
      pageSize = 10,
      sort = 'createdAt',
      order = 'desc',
      categoryId,
      minPrice,
      maxPrice,
      search,
    } = query;

    const qb = this.productRepo
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.category', 'category');

    // Фільтр за категорією
    if (categoryId) {
      qb.andWhere('category.id = :categoryId', { categoryId });
    }

    // Фільтр за ціною
    if (minPrice !== undefined) {
      qb.andWhere('product.price >= :minPrice', { minPrice });
    }
    if (maxPrice !== undefined) {
      qb.andWhere('product.price <= :maxPrice', { maxPrice });
    }

    // Пошук за назвою (case-insensitive)
    if (search) {
      qb.andWhere('product.name ILIKE :search', { search: `%${search}%` });
    }

    // Сортування
    qb.orderBy(`product.${sort}`, order.toUpperCase() as 'ASC' | 'DESC');

    // Пагінація
    const skip = (page - 1) * pageSize;
    qb.skip(skip).take(pageSize);

    // Виконати запит з підрахунком
    const [items, total] = await qb.getManyAndCount();

    const result = {
      items,
      meta: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
      },
    };

    // 4. Зберігаємо отриманий результат у Redis кеш із TTL (час життя) 60 секунд
    // Значення 60_000 передається в мілісекундах
    await this.cacheManager.set(cacheKey, result, 60_000);

    return result;
  }

  async findOne(id: number): Promise<Product> {
    const product = await this.productRepo.findOne({
      where: { id },
      relations: ['category'],
    });
    if (!product) {
      throw new NotFoundException(`Product #${id} not found`);
    }
    return product;
  }

  async create(dto: CreateProductDto): Promise<Product> {
    const product = this.productRepo.create({
      name: dto.name,
      description: dto.description,
      price: dto.price,
      stock: dto.stock ?? 0,
      category: dto.categoryId ? ({ id: dto.categoryId } as any) : undefined,
    });
    const saved = await this.productRepo.save(product);
  await this.clearProductsCache(); // <-- додати
  return saved;
  }

  async update(id: number, dto: UpdateProductDto): Promise<Product> {
    const product = await this.findOne(id);

    if (dto.name !== undefined) product.name = dto.name;
    if (dto.description !== undefined) product.description = dto.description;
    if (dto.price !== undefined) product.price = dto.price;
    if (dto.stock !== undefined) product.stock = dto.stock;
    if (dto.categoryId !== undefined) {
      product.category = { id: dto.categoryId } as any;
    }

    const saved = await this.productRepo.save(product);
  await this.clearProductsCache(); // <-- додати
  return saved;

  }

  async remove(id: number): Promise<void> {
  const product = await this.findOne(id);
  await this.productRepo.remove(product);
  await this.clearProductsCache(); // <-- додати
}
}