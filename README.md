# User Service

Микросервис для управления пользователями с аутентификацией и авторизацией. Разработан в рамках тестового задания.

## 📋 Содержание
- [Функционал](#функционал)
- [Технологии](#технологии)
- [Структура проекта](#структура-проекта)
- [Установка и запуск](#установка-и-запуск)
- [API Endpoints](#api-endpoints)
- [Аутентификация](#аутентификация)
- [Тестирование](#тестирование)
- [Документация Swagger](#документация-swagger)
- [Переменные окружения](#переменные-окружения)

## 🚀 Функционал

- ✅ Регистрация новых пользователей
- ✅ JWT аутентификация
- ✅ Получение пользователя по ID (доступ: админ или сам пользователь)
- ✅ Получение списка пользователей с пагинацией и сортировкой (только админ)
- ✅ Блокировка/разблокировка пользователей (админ или сам пользователь)
- ✅ Валидация входящих данных
- ✅ Централизованная обработка ошибок
- ✅ Swagger документация API

## 🛠 Технологии

- **Node.js** + **Express.js** — серверная платформа
- **TypeScript** — типизация
- **MongoDB** + **Mongoose** — база данных
- **JWT** — аутентификация
- **Bcrypt** — хеширование паролей
- **Express-validator** — валидация данных
- **Jest** + **Supertest** — тестирование
- **ESLint** + **Prettier** — линтинг и форматирование
- **Swagger** — документация API

## 📁 Структура проекта

```
user-service/
├── src/
│   ├── auth/                 # Аутентификация (регистрация, логин)
│   ├── users/                 # Управление пользователями
│   ├── core/                   # Ядро приложения
│   │   ├── adapters/          # Адаптеры (JWT, bcrypt)
│   │   ├── errors/            # Обработка ошибок
│   │   ├── middlewares/       # Middleware (auth guard)
│   │   ├── types/             # TypeScript типы
│   │   └── validators/        # Валидаторы
│   ├── db/                     # Подключение к БД
│   ├── testing/                # Тестовые вспомогательные функции
│   ├── create-admin.ts         # Создание администратора при старте
│   ├── index.ts                # Точка входа
│   └── setup-app.ts            # Настройка Express приложения
├── __tests__/                   # Интеграционные тесты
├── dist/                        # Скомпилированный код
├── .env.example                  # Пример переменных окружения
├── jest.config.js                # Конфигурация Jest
├── tsconfig.json                 # Конфигурация TypeScript
└── package.json                  # Зависимости
```

## ⚙️ Установка и запуск

### Предварительные требования
- Node.js v18 или выше
- MongoDB (локально или Atlas)

### Установка

```bash
# Клонировать репозиторий
git clone https://github.com/your-username/user-service.git
cd user-service

# Установить зависимости
npm install

# Создать файл .env из примера
cp .env.example .env

# Заполнить .env своими данными (см. раздел Переменные окружения)
```

### Запуск

```bash
# Режим разработки (с автоперезагрузкой)
npm run dev

# Сборка проекта
npm run build

# Запуск в production режиме
npm start
```

Сервер запустится на `http://localhost:5001` (или порт указанный в .env)

## 📚 API Endpoints

### Публичные endpoints

| Метод | URL | Описание |
|-------|-----|----------|
| POST | `/api/auth/registration` | Регистрация нового пользователя |
| POST | `/api/auth/login` | Вход в систему |

### Защищенные endpoints (требуют JWT токен)

| Метод | URL | Описание | Доступ |
|-------|-----|----------|--------|
| GET | `/api/users` | Список пользователей с пагинацией | Только admin |
| GET | `/api/users/:id` | Получить пользователя по ID | admin или владелец |
| PATCH | `/api/users/:id/status` | Блокировка/разблокировка | admin или владелец |

## 🔐 Аутентификация

Сервис использует **JWT (JSON Web Tokens)** для аутентификации.

1. **Регистрация** — создает нового пользователя
2. **Логин** — возвращает JWT токен
3. **Защищенные endpoints** — требуют заголовок:
```
Authorization: Bearer <ваш_токен>
```

### Пример логина

```bash
curl -X POST http://localhost:5001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "password": "123456"}'
```

Ответ:
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

## 🧪 Тестирование

```bash
# Запустить все тесты
npm test

# Запустить тесты в watch режиме
npm run test:watch
```

## 📖 Документация Swagger

После запуска сервера документация доступна по адресу:
```
https://user-management-service-production-887d.up.railway.app/api/swagger/
http://localhost:5001/api/swagger
```

Swagger UI позволяет:
- Просматривать все доступные endpoints
- Тестировать API прямо в браузере
- Авторизоваться с помощью JWT токена

## 🔧 Переменные окружения

Создайте файл `.env` на основе `.env.example`:

```env
# Сервер
PORT=5001
NODE_ENV=development

# База данных
MONGO_URL=mongodb://localhost:27017/user-service
DB_NAME=user-service

# JWT
ACCESS_TOKEN_SECRET=your-super-secret-jwt-key
ACCESS_TOKEN_EXPIRES_IN=1h
```

## 📝 Модель пользователя

```typescript
{
  id: string;              // Уникальный идентификатор
  fullName: string;        // Полное имя (ФИО)
  birthDate: Date;         // Дата рождения
  email: string;           // Email (уникальный)
  password: string;        // Хеш пароля
  role: 'admin' | 'user';  // Роль
  isActive: boolean;       // Статус (активен/заблокирован)
  createdAt: Date;         // Дата создания
}
```


MIT


