## Student
- Name: Данііл Коломієць
- Group: 232/2 он
 
## Практичне заняття №4 — DTO + class-validator + Pipes
 
### Структура репозиторію
```
.
├── src/
│   ├── categories/
│   │   ├── dto/
│   │   │   ├── create-category.dto.ts
│   │   │   └── update-category.dto.ts
│   │   ├── category.entity.ts
│   │   ├── categories.module.ts
│   │   ├── categories.service.ts
│   │   └── categories.controller.ts
│   ├── products/
│   │   ├── dto/
│   │   │   ├── create-product.dto.ts
│   │   │   └── update-product.dto.ts
│   │   ├── product.entity.ts
│   │   ├── products.module.ts
│   │   ├── products.service.ts
│   │   └── products.controller.ts
│   ├── common/
│   │   └── pipes/
│   │   	└── trim.pipe.ts
│   ├── migrations/
│   ├── data-source.ts
│   ├── main.ts
│   └── app.module.ts
├── Dockerfile
├── docker-compose.yml
└── README.md
```
 
### Запуск проекту
```bash
cp .env.example .env
docker compose up --build
```
 
### Тест валідації — порожнє ім'я категорії
```text
{"message":["name must be longer than or equal to 2 characters"],"error":"Bad Request","statusCode":400}
```
 
### Тест валідації — від'ємна ціна продукту
```text
{"message":["price must not be less than 0.01"],"error":"Bad Request","statusCode":400}
```
 
### Тест валідації — зайве поле
```text
{"message":["property isAdmin should not exist"],"error":"Bad Request","statusCode":400}
```
 
### Тест TrimPipe
```text
{"id":6,"name":"Trimmed","description":null,"createdAt":"2026-04-26T15:21:31.695Z"}
```
 
### Тест валідне створення продукту
```text
{"id":4,"name":"Молоко","description":null,"price":45,"stock":0,"isActive":true,"createdAt":"2026-04-26T15:22:10.073Z","updatedAt":"2026-04-26T15:22:10.073Z"}
```


 
