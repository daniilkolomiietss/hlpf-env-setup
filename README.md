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
