## Student
- Name: Коломієць Данііл
- Group: 232/2 он
 
## Практичне заняття №5 — JWT Authentication + Guards + RBAC
 
### Структура репозиторію
```
.
├── src/
│   ├── auth/
│   │   ├── dto/
│   │   │   ├── register.dto.ts
│   │   │   └── login.dto.ts
│   │   ├── auth.module.ts
│   │   ├── auth.service.ts
│   │   └── auth.controller.ts
│   ├── users/
│   │   ├── user.entity.ts
│   │   ├── users.module.ts
│   │   └── users.service.ts
│   ├── common/
│   │   ├── enums/
│   │   │   └── role.enum.ts
│   │   ├── guards/
│   │   │   ├── jwt-auth.guard.ts
│   │   │   └── roles.guard.ts
│   │   ├── decorators/
│   │   │   ├── current-user.decorator.ts
│   │   │   └── roles.decorator.ts
│   │   └── pipes/
│   │   	└── trim.pipe.ts
│   ├── categories/ ...
│   ├── products/ ...
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
 
### API Endpoints
| Method | URL | Auth | Role |
|--------|-----|------|------|
| POST | /auth/register | - | - |
| POST | /auth/login | - | - |
| GET | /api/categories | - | - |
| POST | /api/categories | JWT | admin |
| GET | /api/products | - | - |
| POST | /api/products | JWT | admin |
| PATCH | /api/products/:id | JWT | admin |
| DELETE | /api/products/:id | JWT | admin |
 
### Тест реєстрації
```text
HTTP/1.1 409 Conflict
X-Powered-By: Express
Content-Type: application/json; charset=utf-8
Content-Length: 85
ETag: W/"55-B8U14sXoAMnNDFe1hqTpiUNB3EU"
Date: Tue, 28 Apr 2026 09:33:10 GMT
Connection: keep-alive
Keep-Alive: timeout=5

{"message":"User with this email already exists","error":"Conflict","statusCode"
```
 
### Тест логіну
```text
HTTP/1.1 200 OK
X-Powered-By: Express
Content-Type: application/json; charset=utf-8
Content-Length: 210
ETag: W/"d2-lZLMjorxdcZQ11fUHkFZybVqX4w"
Date: Tue, 28 Apr 2026 09:33:49 GMT
Connection: keep-alive
Keep-Alive: timeout=5

{"accessToken":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsImVtYWlsIjoiYWRtaW5AdGVzdC5jb20iLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3NzczNjg4MjksImV4cCI6MTc3NzM3MjQyOX0.76hY8249TNYHaIIEVBqGLGP4u-nSxX2PiLuKpVU3oos"}
```
 
### Тест 401 — запит без токена
```text
HTTP/1.1 401 Unauthorized
X-Powered-By: Express
Content-Type: application/json; charset=utf-8
Content-Length: 81
ETag: W/"51-iX0bTger5FpYClQdUjw9S3LEbtQ"
Date: Tue, 28 Apr 2026 09:34:23 GMT
Connection: keep-alive
Keep-Alive: timeout=5

{"message":"Missing authorization token","error":"Unauthorized","statusCode":401
```
 
### Тест 403 — запит з роллю user
```text
HTTP/1.1 401 Unauthorized
X-Powered-By: Express
Content-Type: application/json; charset=utf-8
Content-Length: 78
ETag: W/"4e-bCtcmgfHD0YzzyKTlGcLAj+Xg4w"
Date: Tue, 28 Apr 2026 09:34:52 GMT
Connection: keep-alive
Keep-Alive: timeout=5

{"message":"Invalid or expired token","error":"Unauthorized","statusCode":401}
```
 
### Тест успішного створення від admin
```text
HTTP/1.1 201 Created
X-Powered-By: Express
Content-Type: application/json; charset=utf-8
Content-Length: 169
ETag: W/"a9-RuhMEb9Lu6pk2R+h+FjziN7yyWg"
Date: Tue, 28 Apr 2026 09:38:18 GMT
Connection: keep-alive
Keep-Alive: timeout=5

{"id":5,"name":"MacBook Pro","description":null,"price":2499.99,"stock":10,"isActive":true,"createdAt":"2026-04-28T09:38:18.025Z","updatedAt":"2026-04-28T09:38:18.025Z"}
```

 
