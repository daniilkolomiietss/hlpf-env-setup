import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import { Product } from '../products/product.entity';
// Перевірте шлях до категорії у вашому проєкті (можливо, ../categories/category.entity)
// Якщо категорія лежить в іншому місці, підставте правильний імпорт
import { Category } from '../categories/category.entity'; 

dotenv.config();

const ds = new DataSource({
  type: 'postgres',
  host: process.env.POSTGRES_HOST || 'postgres',
  port: parseInt(process.env.POSTGRES_PORT || '5432', 10),
  username: process.env.POSTGRES_USER || 'nestuser',
  password: process.env.POSTGRES_PASSWORD || 'nestpassword',
  database: process.env.POSTGRES_DB || 'nestdb',
  entities: [Product, Category], // Передаємо сутності, щоб TypeORM підтягнув схему
});

async function seed() {
  await ds.initialize();
  console.log('[Database] Успішно підключено через TypeORM!');

  const categoryRepo = ds.getRepository(Category);
  const productRepo = ds.getRepository(Product);

  // 1. Створюємо категорії
  const catNames = ['Electronics', 'Accessories', 'Clothing'];
  const savedCategories: Category[] = [];

  for (const name of catNames) {
    let category = await categoryRepo.findOne({ where: { name } });
    if (!category) {
      category = categoryRepo.create({ name });
      category = await categoryRepo.save(category);
    }
    savedCategories.push(category);
  }
  console.log('[Seed] Категорії перевірено/створено');

  // Перевірка на випадок, якщо масив порожній
  if (savedCategories.length < 3) {
    throw new Error('Не вдалося ініціалізувати категорії для продуктів');
  }

  // 2. Шаблони продуктів (індекси категорій: 0 - Electronics, 1 - Accessories, 2 - Clothing)
  const productsTemplate = [
    { name: 'iPhone 16', price: 999, stock: 50, catIdx: 0 },
    { name: 'Galaxy S24', price: 849, stock: 40, catIdx: 0 },
    { name: 'MacBook Pro', price: 2499, stock: 15, catIdx: 0 },
    { name: 'iPad Air', price: 599, stock: 30, catIdx: 0 },
    { name: 'AirPods Pro', price: 249, stock: 100, catIdx: 1 },
    { name: 'USB-C Cable', price: 19, stock: 500, catIdx: 1 },
    { name: 'MagSafe Charger', price: 39, stock: 80, catIdx: 1 },
    { name: 'Laptop Sleeve', price: 49, stock: 60, catIdx: 1 },
    { name: 'T-Shirt Dev', price: 25, stock: 200, catIdx: 2 },
    { name: 'Hoodie NestJS', price: 55, stock: 75, catIdx: 2 },
  ];

  // 3. Генеруємо 30 записів
  for (let i = 0; i < 3; i++) {
    for (const p of productsTemplate) {
      const targetName = i > 0 ? `${p.name} v${i + 1}` : p.name;
      
      // Перевіряємо, чи немає вже такого продукту
      const exists = await productRepo.findOne({ where: { name: targetName } });
      if (!exists) {
        const newProduct = productRepo.create({
          name: targetName,
          price: p.price + i * 10,
          stock: p.stock,
          category: savedCategories[p.catIdx], // Передаємо весь об'єкт категорії, TypeORM сам зв'яже ID!
        });
        await productRepo.save(newProduct);
      }
    }
  }

  console.log('Seed complete: 3 categories, 30 products');
  await ds.destroy();
}

seed().catch(async (error) => {
  console.error('Помилка сидингу:', error);
  if (ds.isInitialized) await ds.destroy();
});