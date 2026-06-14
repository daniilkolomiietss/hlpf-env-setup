## Student
- Name: Коломієць Данііл
- Group: 232/2
 
## MiniShop API — Фінальний проєкт
 
REST API інтернет-магазину на NestJS + PostgreSQL + Redis.
 
### Технології
- NestJS + TypeScript
- PostgreSQL + TypeORM (міграції, QueryBuilder)
- Redis (кешування з інвалідацією)
- JWT автентифікація + RBAC авторизація
- class-validator + class-transformer
- Swagger / OpenAPI
 
### Запуск
```bash
cp .env.example .env
docker compose up --build
docker compose run --rm app npm run seed
```
 
### Swagger UI
http://localhost:3000/api/docs
 
### API Endpoints
 
#### Auth
| Method | URL | Auth | Опис |
|--------|-----|------|------|
| POST | /auth/register | - | Реєстрація |
| POST | /auth/login | - | Логін → JWT |
 
#### Categories
| Method | URL | Auth | Опис |
|--------|-----|------|------|
| GET | /api/categories | - | Список |
| GET | /api/categories/:id | - | Одна |
| POST | /api/categories | admin | Створити |
| PATCH | /api/categories/:id | admin | Оновити |
| DELETE | /api/categories/:id | admin | Видалити |
 
#### Products
| Method | URL | Auth | Опис |
|--------|-----|------|------|
| GET | /api/products | - | Список + pagination + filter |
| GET | /api/products/:id | - | Один |
| POST | /api/products | admin | Створити |
| PATCH | /api/products/:id | admin | Оновити |
| DELETE | /api/products/:id | admin | Видалити |
 
#### Orders
| Method | URL | Auth | Опис |
|--------|-----|------|------|
| POST | /api/orders | user | Створити замовлення |
| GET | /api/orders | user | Мої / Всі (admin) |
| GET | /api/orders/:id | user | Одне (ownership) |
| PATCH | /api/orders/:id/status | admin | Змінити статус |
| DELETE | /api/orders/:id | admin | Видалити |
 
### Тест створення замовлення
```text
code 201

{
  "data": {
    "id": 21,
    "status": "pending",
    "totalPrice": "2247.00",
    "user": {
      "id": 5
    },
    "items": [
      {
        "id": 41,
        "quantity": 2,
        "price": "999.00",
        "product": {
          "id": 1,
          "name": "iPhone 16",
          "description": null,
          "price": "999.00",
          "stock": 38,
          "isActive": true,
          "createdAt": "2026-06-12T09:52:13.264Z",
          "updatedAt": "2026-06-14T12:06:38.189Z"
        }
      },
      {
        "id": 42,
        "quantity": 1,
        "price": "249.00",
        "product": {
          "id": 5,
          "name": "AirPods Pro",
          "description": null,
          "price": "249.00",
          "stock": 92,
          "isActive": true,
          "createdAt": "2026-06-12T09:52:13.302Z",
          "updatedAt": "2026-06-14T12:06:38.189Z"
        }
      }
    ],
    "createdAt": "2026-06-14T12:06:38.189Z"
  },
  "statusCode": 201,
  "timestamp": "2026-06-14T12:06:38.221Z"
}
```
 
### Тест ownership (403)
```text
Code 403

{
  "error": {
    "code": 403,
    "message": "У вас немає доступу до цього замовлення",
    "traceId": "ba2ade8c-bed5-4d0e-9c9c-3c1d72367cb3"
  },
  "timestamp": "2026-06-14T12:10:21.972Z"
}
```
 
### Тест зміни статусу
```text
code 200

{
  "data": {
    "id": 21,
    "status": "delivered",
    "totalPrice": "2247.00",
    "items": [
      {
        "id": 41,
        "quantity": 2,
        "price": "999.00",
        "product": {
          "id": 1,
          "name": "iPhone 16",
          "description": null,
          "price": "999.00",
          "stock": 38,
          "isActive": true,
          "createdAt": "2026-06-12T09:52:13.264Z",
          "updatedAt": "2026-06-14T12:06:38.189Z"
        }
      },
      {
        "id": 42,
        "quantity": 1,
        "price": "249.00",
        "product": {
          "id": 5,
          "name": "AirPods Pro",
          "description": null,
          "price": "249.00",
          "stock": 92,
          "isActive": true,
          "createdAt": "2026-06-12T09:52:13.302Z",
          "updatedAt": "2026-06-14T12:06:38.189Z"
        }
      }
    ],
    "createdAt": "2026-06-14T12:06:38.189Z"
  },
  "statusCode": 200,
  "timestamp": "2026-06-14T12:12:30.708Z"
}
```
 
### Тест insufficient stock
```text
Code 400

{
  "error": {
    "code": 400,
    "message": "Недостатньо товару \"AirPods Pro\" на складі. Доступно: 92, запитано: 999999999",
    "traceId": "ada952e4-2f03-4625-a8bf-38e6ca6a0366"
  },
  "timestamp": "2026-06-14T12:13:09.250Z"
}
```