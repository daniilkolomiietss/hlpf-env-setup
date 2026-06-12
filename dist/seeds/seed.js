"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
const dotenv = __importStar(require("dotenv"));
const product_entity_1 = require("../products/product.entity");
const category_entity_1 = require("../categories/category.entity");
dotenv.config();
const ds = new typeorm_1.DataSource({
    type: 'postgres',
    host: process.env.POSTGRES_HOST || 'postgres',
    port: parseInt(process.env.POSTGRES_PORT || '5432', 10),
    username: process.env.POSTGRES_USER || 'nestuser',
    password: process.env.POSTGRES_PASSWORD || 'nestpassword',
    database: process.env.POSTGRES_DB || 'nestdb',
    entities: [product_entity_1.Product, category_entity_1.Category],
});
async function seed() {
    await ds.initialize();
    console.log('[Database] Успішно підключено через TypeORM!');
    const categoryRepo = ds.getRepository(category_entity_1.Category);
    const productRepo = ds.getRepository(product_entity_1.Product);
    const catNames = ['Electronics', 'Accessories', 'Clothing'];
    const savedCategories = [];
    for (const name of catNames) {
        let category = await categoryRepo.findOne({ where: { name } });
        if (!category) {
            category = categoryRepo.create({ name });
            category = await categoryRepo.save(category);
        }
        savedCategories.push(category);
    }
    console.log('[Seed] Категорії перевірено/створено');
    if (savedCategories.length < 3) {
        throw new Error('Не вдалося ініціалізувати категорії для продуктів');
    }
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
    for (let i = 0; i < 3; i++) {
        for (const p of productsTemplate) {
            const targetName = i > 0 ? `${p.name} v${i + 1}` : p.name;
            const exists = await productRepo.findOne({ where: { name: targetName } });
            if (!exists) {
                const newProduct = productRepo.create({
                    name: targetName,
                    price: p.price + i * 10,
                    stock: p.stock,
                    category: savedCategories[p.catIdx],
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
    if (ds.isInitialized)
        await ds.destroy();
});
//# sourceMappingURL=seed.js.map