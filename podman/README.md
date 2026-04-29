# Aromachef Podman Local Dev Checklist

Файл с командами для локальной работы с проектом Aromachef через Podman Compose.

## 1. Перейти в папку с compose

```bash
cd ./podman
```

> Compose-файл видит `.env` в корне проекта

## 2. Поднять все контейнеры (в фоне)

```bash
podman compose up -d
```

* MariaDB автоматически выполнит SQL-файлы из [../src/sql](../src/sql) при первом запуске
* Приложение или другие сервисы тоже стартуют, если они есть в compose

## 3. Смотреть логи всех контейнеров

```bash
podman-compose logs -f
```

* `-f` — лог в реальном времени
* Для выхода `Ctrl+C`

## 4. Подключение к MariaDB

```bash
podman exec -it aromachef-db mariadb -u${DB_USER} -p${DB_PASSWORD} ${DB_NAME}
```

* Проверка таблиц:

```sql
SHOW TABLES;
```

## 5. Остановка контейнеров

```bash
podman-compose down
```

* Останавливает контейнеры, volume с данными остаётся

## 6. Очистка базы и повторное выполнение SQL

```bash
# 1. Удаляем volume с данными
podman volume rm aromachef_podman_db_data

# 2. Поднимаем контейнер заново
podman-compose up -d
```

> После этого MariaDB снова выполнит SQL из `src/sql`

## 7. Полезные дополнительные команды

```bash
# Список всех контейнеров проекта
podman-compose ps

# Выполнить команду внутри контейнера
podman exec -it aromachef-db bash

# Очистить все остановленные контейнеры и ненужные volume
podman system prune -a
```
