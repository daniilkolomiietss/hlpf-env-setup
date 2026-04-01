## Student
- Name: Коломієць Данііл
- Group: 232/2 он
```text
<вивід docker --version>
Docker version 28.2.2, build 28.2.2-0ubuntu1~24.04.1

<вивід docker compose version>
Docker Compose version 2.37.1+ds1-0ubuntu2~24.04.1

<вивід docker run --rm hello-world (ключові рядки, які показують успіх)>
Hello from Docker!
This message shows that your installation appears to be working correctly.

<вивід docker compose run --rm npm npm -v>
WARN[0000] Found orphan containers ([hlpf-env-setup-app-1 hlpf-env-setup-postgres-1 hlpf-env-setup-redis-1]) for this project. If you removed or renamed this service in your compose file, you can run this command with the --remove-orphans flag to clean it up. 
11.12.1


Файл .env доданий до github в рамках навчання


docker compose up postgres redis -d
WARN[0000] Found orphan containers ([hlpf-env-setup-npm-1]) for this project. If you removed or renamed this service in your compose file, you can run this command with the --remove-orphans flag to clean it up. 
[+] Running 2/2
 ✔ Container hlpf-env-setup-postgres-1  Running                            0.0s 
 ✔ Container hlpf-env-setup-redis-1     Running                            0.0s 
 
 
curl http://localhost:3000
Hello World!



## Практичне заняття №2 — NestJS + PostgreSQL + Redis
 
## Структура репозиторію
```
.
├── src/              	# NestJS source code
├── Dockerfile
├── docker-compose.yml
├── .env.example      	# шаблон змінних оточення
└── README.md
```
 
## Перевірка сервісів
```text
На четвертій вправі у файлі app.moduls помилки. Я намагався завантажити всі пакети, виправити код, та нічого не працює. Відповідно, нічого більше не запускається.

Starting compilation in watch mode...
app-1       | 
app-1       | src/app.module.ts:2:30 - error TS2307: Cannot find module '@nestjs/config' or its corresponding type declarations.
app-1       | 
app-1       | 2 import { ConfigModule } from '@nestjs/config';
app-1       |                                ~~~~~~~~~~~~~~~~
app-1       | 
app-1       | src/app.module.ts:3:31 - error TS2307: Cannot find module '@nestjs/typeorm' or its corresponding type declarations.
app-1       | 
app-1       | 3 import { TypeOrmModule } from '@nestjs/typeorm';
app-1       |                                 ~~~~~~~~~~~~~~~~~
app-1       | 
app-1       | src/app.module.ts:4:29 - error TS2307: Cannot find module '@nestjs/cache-manager' or its corresponding type declarations.
app-1       | 
app-1       | 4 import { CacheModule } from '@nestjs/cache-manager';
app-1       |                               ~~~~~~~~~~~~~~~~~~~~~~~
app-1       | 
app-1       | src/app.module.ts:5:28 - error TS2307: Cannot find module 'cache-manager-redis-yet' or its corresponding type declarations.
app-1       | 
app-1       | 5 import { redisStore } from 'cache-manager-redis-yet';
app-1       |                              ~~~~~~~~~~~~~~~~~~~~~~~~~
app-1       | 
app-1       | src/app.module.ts:15:19 - error TS2345: Argument of type 'string | undefined' is not assignable to parameter of type 'string'.
app-1       |   Type 'undefined' is not assignable to type 'string'.
app-1       | 
app-1       | 15    port: parseInt(process.env.POSTGRES_PORT, 10),
app-1       |                      ~~~~~~~~~~~~~~~~~~~~~~~~~
app-1       | 
app-1       | src/app.module.ts:28:25 - error TS2345: Argument of type 'string | undefined' is not assignable to parameter of type 'string'.
app-1       |   Type 'undefined' is not assignable to type 'string'.
app-1       | 
app-1       | 28          port: parseInt(process.env.REDIS_PORT, 10),
app-1       |                            ~~~~~~~~~~~~~~~~~~~~~~
app-1       | 
app-1       | [11:54:05 AM] Found 6 errors. Watching for file changes.
app-1       | 


```
 
