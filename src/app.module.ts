import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CacheModule } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-redis-yet';
//import { AddIsActiveToProducts1775084691507 } from './migrations/1775084691507-AddIsActiveToProducts';
import { CreateUsers1777288268548 } from './migrations/1777288268548-CreateUsers';
import { Category } from './categories/category.entity';
import { Product } from './products/product.entity';
import { CategoriesModule } from './categories/categories.module';
import { ProductsModule } from './products/products.module';
import { User } from './users/user.entity';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
 
//import { CreateTables1700000001000 }
// from './migrations/1700000001000-CreateTables';
// import { AddIsActiveToProducts... }
//   from './migrations/...-AddIsActiveToProducts';
 
import { AppController } from './app.controller';
import { AppService } from './app.service';
 
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
 
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.POSTGRES_HOST,
      port: parseInt(process.env.POSTGRES_PORT ?? '5432', 10),
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DB,
      entities: [Category, Product, User],
      synchronize: false,
      migrationsRun: true,
      migrations: [
        //CreateTables1700000001000,
        //AddIsActiveToProducts1775084691507,
        CreateUsers1777288268548,
      ],
    }),
 
    UsersModule,
    AuthModule,
 
    CacheModule.registerAsync({
      isGlobal: true,
      useFactory: async () => ({
        store: await redisStore({
          socket: {
            host: process.env.REDIS_HOST ?? 'localhost',
            port: parseInt(process.env.REDIS_PORT ?? '6379', 10),
          },
        }),
        ttl: 60 * 1000,
      }),
    }),
 
    CategoriesModule,
    ProductsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}