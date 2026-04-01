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
 
## Запуск проекту
```bash
cp .env.example .env   # налаштувати значення
docker compose up --build
```
 
## Перевірка сервісів
```text
NAME                        IMAGE                COMMAND                  SERVICE    CREATED         STATUS                   PORTS
hlpf-env-setup-app-1        hlpf-env-setup-app   "docker-entrypoint.s…"   app        3 minutes ago   Up 2 minutes             0.0.0.0:3000->3000/tcp, [::]:3000->3000/tcp
hlpf-env-setup-postgres-1   postgres:16-alpine   "docker-entrypoint.s…"   postgres   3 minutes ago   Up 2 minutes (healthy)   0.0.0.0:5432->5432/tcp, [::]:5432->5432/tcp
hlpf-env-setup-redis-1      redis:7-alpine       "docker-entrypoint.s…"   redis      3 minutes ago   Up 2 minutes (healthy)   0.0.0.0:6379->6379/tcp, [::]:6379->6379/tcp

```
 
## Перевірка PostgreSQL
```text
                                                     List of databases
   Name    |  Owner   | Encoding | Locale Provider |  Collate   |   Ctype    | ICU Locale | ICU Rules |   Access privileges   
-----------+----------+----------+-----------------+------------+------------+------------+-----------+-----------------------
 nestdb    | nestuser | UTF8     | libc            | en_US.utf8 | en_US.utf8 |            |           | 
 postgres  | nestuser | UTF8     | libc            | en_US.utf8 | en_US.utf8 |            |           | 
 template0 | nestuser | UTF8     | libc            | en_US.utf8 | en_US.utf8 |            |           | =c/nestuser          +
           |          |          |                 |            |            |            |           | nestuser=CTc/nestuser
 template1 | nestuser | UTF8     | libc            | en_US.utf8 | en_US.utf8 |            |           | =c/nestuser          +
           |          |          |                 |            |            |            |           | nestuser=CTc/nestuser
(4 rows)


```
 
## Перевірка Redis
```text
PONG
```
 
## Перевірка застосунку
```text
Hello World!
```
 
## Логи NestJS (фрагмент)
```text
app-1  | 
app-1  | [1:43:48 PM] Found 0 errors. Watching for file changes.
```

 
