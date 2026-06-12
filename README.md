## Student
- Name: Коломієць Данііл
- Group: 232/2
 
## Практичне заняття №7 — Redis + Pagination + Filtering
 
### Запуск проекту
```bash
cp .env.example .env
docker compose up --build
docker compose run --rm app npm run seed
```
 
### API: GET /api/products
 
| Параметр | Тип | Default | Опис |
|----------|-----|---------|------|
| page | number | 1 | Номер сторінки |
| pageSize | number | 10 | Елементів на сторінку (max 100) |
| sort | string | createdAt | Поле сортування |
| order | asc/desc | desc | Напрямок |
| categoryId | number | - | Фільтр за категорією |
| minPrice | number | - | Мінімальна ціна |
| maxPrice | number | - | Максимальна ціна |
| search | string | - | Пошук за назвою (ILIKE) |
 
### Тест пагінації
```text
{"data":{"items":[{"id":30,"name":"Hoodie NestJS v3","description":null,"price":"75.00","stock":75,"isActive":true,"category":{"id":3,"name":"Clothing","description":null,"createdAt":"2026-06-12T09:45:59.157Z"},"createdAt":"2026-06-12T09:52:13.377Z","updatedAt":"2026-06-12T09:52:13.377Z"},{"id":29,"name":"T-Shirt Dev v3","description":null,"price":"45.00","stock":200,"isActive":true,"category":{"id":3,"name":"Clothing","description":null,"createdAt":"2026-06-12T09:45:59.157Z"},"createdAt":"2026-06-12T09:52:13.374Z","updatedAt":"2026-06-12T09:52:13.374Z"},{"id":28,"name":"Laptop Sleeve v3","description":null,"price":"69.00","stock":60,"isActive":true,"category":{"id":2,"name":"Accessories","description":null,"createdAt":"2026-06-12T09:45:59.156Z"},"createdAt":"2026-06-12T09:52:13.371Z","updatedAt":"2026-06-12T09:52:13.371Z"},{"id":27,"name":"MagSafe Charger v3","description":null,"price":"59.00","stock":80,"isActive":true,"category":{"id":2,"name":"Accessories","description":null,"createdAt":"2026-06-12T09:45:59.156Z"},"createdAt":"2026-06-12T09:52:13.369Z","updatedAt":"2026-06-12T09:52:13.369Z"},{"id":26,"name":"USB-C Cable v3","description":null,"price":"39.00","stock":500,"isActive":true,"category":{"id":2,"name":"Accessories","description":null,"createdAt":"2026-06-12T09:45:59.156Z"},"createdAt":"2026-06-12T09:52:13.365Z","updatedAt":"2026-06-12T09:52:13.365Z"}],"meta":{"page":1,"pageSize":5,"total":30,"totalPages":6}},"statusCode":200,"timestamp":"2026-06-12T10:08:31.051Z"}
```
 
### Тест фільтрації
```text
{"data":{"items":[{"id":24,"name":"iPad Air v3","description":null,"price":"619.00","stock":30,"isActive":true,"category":{"id":1,"name":"Electronics","description":null,"createdAt":"2026-06-12T09:45:59.152Z"},"createdAt":"2026-06-12T09:52:13.360Z","updatedAt":"2026-06-12T09:52:13.360Z"},{"id":23,"name":"MacBook Pro v3","description":null,"price":"2519.00","stock":15,"isActive":true,"category":{"id":1,"name":"Electronics","description":null,"createdAt":"2026-06-12T09:45:59.152Z"},"createdAt":"2026-06-12T09:52:13.358Z","updatedAt":"2026-06-12T09:52:13.358Z"},{"id":22,"name":"Galaxy S24 v3","description":null,"price":"869.00","stock":40,"isActive":true,"category":{"id":1,"name":"Electronics","description":null,"createdAt":"2026-06-12T09:45:59.152Z"},"createdAt":"2026-06-12T09:52:13.354Z","updatedAt":"2026-06-12T09:52:13.354Z"},{"id":21,"name":"iPhone 16 v3","description":null,"price":"1019.00","stock":50,"isActive":true,"category":{"id":1,"name":"Electronics","description":null,"createdAt":"2026-06-12T09:45:59.152Z"},"createdAt":"2026-06-12T09:52:13.352Z","updatedAt":"2026-06-12T09:52:13.352Z"},{"id":14,"name":"iPad Air v2","description":null,"price":"609.00","stock":30,"isActive":true,"category":{"id":1,"name":"Electronics","description":null,"createdAt":"2026-06-12T09:45:59.152Z"},"createdAt":"2026-06-12T09:52:13.331Z","updatedAt":"2026-06-12T09:52:13.331Z"},{"id":13,"name":"MacBook Pro v2","description":null,"price":"2509.00","stock":15,"isActive":true,"category":{"id":1,"name":"Electronics","description":null,"createdAt":"2026-06-12T09:45:59.152Z"},"createdAt":"2026-06-12T09:52:13.328Z","updatedAt":"2026-06-12T09:52:13.328Z"},{"id":12,"name":"Galaxy S24 v2","description":null,"price":"859.00","stock":40,"isActive":true,"category":{"id":1,"name":"Electronics","description":null,"createdAt":"2026-06-12T09:45:59.152Z"},"createdAt":"2026-06-12T09:52:13.324Z","updatedAt":"2026-06-12T09:52:13.324Z"},{"id":11,"name":"iPhone 16 v2","description":null,"price":"1009.00","stock":50,"isActive":true,"category":{"id":1,"name":"Electronics","description":null,"createdAt":"2026-06-12T09:45:59.152Z"},"createdAt":"2026-06-12T09:52:13.322Z","updatedAt":"2026-06-12T09:52:13.322Z"},{"id":4,"name":"iPad Air","description":null,"price":"599.00","stock":30,"isActive":true,"category":{"id":1,"name":"Electronics","description":null,"createdAt":"2026-06-12T09:45:59.152Z"},"createdAt":"2026-06-12T09:52:13.298Z","updatedAt":"2026-06-12T09:52:13.298Z"},{"id":3,"name":"MacBook Pro","description":null,"price":"2499.00","stock":15,"isActive":true,"category":{"id":1,"name":"Electronics","description":null,"createdAt":"2026-06-12T09:45:59.152Z"},"createdAt":"2026-06-12T09:52:13.295Z","updatedAt":"2026-06-12T09:52:13.295Z"}],"meta":{"page":1,"pageSize":10,"total":12,"totalPages":2}},"statusCode":200,"timestamp":"2026-06-12T10:08:57.181Z"}
```
 
### Тест пошуку
```text
{"data":{"items":[{"id":23,"name":"MacBook Pro v3","description":null,"price":"2519.00","stock":15,"isActive":true,"category":{"id":1,"name":"Electronics","description":null,"createdAt":"2026-06-12T09:45:59.152Z"},"createdAt":"2026-06-12T09:52:13.358Z","updatedAt":"2026-06-12T09:52:13.358Z"},{"id":13,"name":"MacBook Pro v2","description":null,"price":"2509.00","stock":15,"isActive":true,"category":{"id":1,"name":"Electronics","description":null,"createdAt":"2026-06-12T09:45:59.152Z"},"createdAt":"2026-06-12T09:52:13.328Z","updatedAt":"2026-06-12T09:52:13.328Z"},{"id":3,"name":"MacBook Pro","description":null,"price":"2499.00","stock":15,"isActive":true,"category":{"id":1,"name":"Electronics","description":null,"createdAt":"2026-06-12T09:45:59.152Z"},"createdAt":"2026-06-12T09:52:13.295Z","updatedAt":"2026-06-12T09:52:13.295Z"}],"meta":{"page":1,"pageSize":10,"total":3,"totalPages":1}},"statusCode":200,"timestamp":"2026-06-12T10:09:14.366Z"}
```
 
### Тест кешування (Redis)
```text
(empty array)
```
 
### Тест інвалідації кешу
```text
<Redis KEYS до та після POST /api/products>
```