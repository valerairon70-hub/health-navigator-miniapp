# Backend Plan — Health Navigator Pro (White-Label Platform)

> Архитектурный план построения многопользовательской платформы.
> Разработка: Claude Code + Валерий Созанов, без сторонних разработчиков.
> Дата: март 2026 | Обновлён после критического разбора.

---

## Принцип проектирования

**Не строить завтра то, что не нужно сегодня.**

Каждая фаза — рабочий продукт, который можно монетизировать. Переход к следующей фазе происходит только тогда, когда текущей уже недостаточно.

```
Фаза 1 (сейчас)     Фаза 2 (рост)        Фаза 3 (масштаб)
5–10 человек    →   10–50 человек    →   50+ человек
Мин. бэкенд         Supabase             Полноценный SaaS
Ручная настройка    Полуавтомат.         Самообслуживание
Базовый WL          Полный White-Label    Custom-домены
```

---

## White Label — что это значит для Telegram Mini App

**Цель:** дистрибьютор выглядит как самостоятельный профессиональный специалист — без следов «общего шаблона».

### Что брендируется (по фазам)

| Элемент | Где меняется | Фаза |
|---------|-------------|------|
| Имя бота (`@anna_health_bot`) | BotFather — дистрибьютор сам | 1 |
| Аватар бота (фото специалиста) | BotFather — дистрибьютор сам | 1 |
| Описание бота | BotFather — дистрибьютор сам | 1 |
| Цвет акцента в приложении | `primaryColor` в конфиге | 1 |
| Цвет шапки Telegram (`tg.setHeaderColor`) | из конфига автоматически | 1 |
| Имя, фото, роль, факт специалиста | конфиг | 1 |
| Темы симптомов и отзывы | конфиг | 1 |
| Поддомен `anna.healthnav.pro` | Vercel wildcard domains (Pro план) | 2 |
| OG-превью ссылки (картинка при шаринге) | meta-теги из конфига | 2 |
| Убрать надпись «Powered by Health Navigator» | платный тариф | 2 |
| Собственный домен `anna-health.ru` | Vercel custom domain | 3 |

### Что НЕ брендируется (ограничение Telegram)
- Нельзя скрыть что это Telegram Mini App — ограничение платформы, не наше
- Иконка внутри приложения определяется аватаром бота (управляется дистрибьютором)

### «Powered by» как инструмент монетизации

Стандартная SaaS-механика — работает у Notion, Typeform, Calendly:

```
Демо / бесплатно  →  В футере: «Создано на платформе Health Navigator»
Платный тариф     →  Надпись убирается. Полный white-label.
```

---

## Решение по боту: каждый получает СВОЙ бот ✅

**Каждый дистрибьютор создаёт свой бот через @BotFather.**

**Почему:**
- Дистрибьюторы строят личный бренд — бот называется «Навигатор Анны», не «общий бот»
- Независимость: проблема у одного не затрагивает других
- Профессиональнее для конечного клиента
- Telegram не ограничивает количество ботов

**Схема:**
```
Дистрибьютор А → @anna_health_bot  → healthnav.vercel.app?startapp=anna
Дистрибьютор Б → @ivan_health_bot  → healthnav.vercel.app?startapp=ivan
Дистрибьютор В → @olga_health_bot  → healthnav.vercel.app?startapp=olga
              ↑                              ↑
        Свой бот в Telegram          Одно приложение, разные конфиги
```

### Как идентифицируется дистрибьютор — ПРАВИЛЬНЫЙ способ

⚠️ **Важно:** используем `start_param` — стандарт Telegram Mini App, а не произвольный URL-параметр.

```
Ссылка на Mini App: https://t.me/anna_health_bot/app?startapp=anna
                                                       ↑
                              Telegram передаёт это в tg.initDataUnsafe.start_param
```

В коде приложения:
```typescript
// Приоритет 1: Telegram start_param (работает во всех клиентах)
const slug = tg.initDataUnsafe?.start_param
// Приоритет 2: URL-параметр ?d=slug (fallback для браузера и тестирования)
  ?? new URLSearchParams(window.location.search).get('d')
  ?? 'default';
```

Почему это важно: Telegram iOS/Android/Desktop по-разному обрабатывают URL-параметры при открытии Mini App. `start_param` — единственный гарантированный механизм платформы.

---

## Технологический стек

### Фаза 1 — Vercel Serverless Functions (минимальный бэкенд)

⚠️ **Исправление исходного плана:** конфиги НЕ хранятся в публичном репозитории GitHub.

**Почему это было ошибкой:**
- Публичный репо = все данные дистрибьюторов видны любому в интернете
- Поле `"plan": "demo"` в файле — не работающая защита: ничто не мешает обойти её на клиенте
- Git хранит историю — удалённые файлы можно восстановить

**Правильное решение для Фазы 1:**

Конфиги хранятся в **Vercel Environment Variables** (зашифрованные) и отдаются через serverless endpoint с проверкой активности плана:

```
GET /api/config?d=anna
  → проверяет: активен ли план дистрибьютора
  → если да: отдаёт конфиг
  → если нет: отдаёт { error: 'inactive', redirect: '/plan-expired' }
```

Для Фазы 1 (5–10 человек) конфиги хранятся как JSON в Vercel Environment Variables:
```
DISTRIBUTOR_ANNA = {"name":"Анна","username":"anna_smirnova",...}
DISTRIBUTOR_IVAN = {"name":"Иван","username":"ivan_health",...}
```

Vercel Functions — уже включены в бесплатный план Vercel, не нужен отдельный сервер.

### Фаза 2 — Supabase

**Supabase** — оптимальный выбор для нашего случая:

| Критерий | Supabase Pro | Neon + Vercel KV | PocketBase (VPS) |
|----------|-------------|-----------------|-----------------|
| Цена | $25/мес | ~$0–10/мес | $10–20/мес VPS |
| Паузировка БД | ❌ нет (Pro) | ❌ нет | ❌ нет |
| Auth | ✅ встроен | ⚠️ нужно добавить | ✅ встроен |
| Storage (фото) | ✅ встроен | ⚠️ нужно добавить | ✅ встроен |
| REST API из коробки | ✅ авто-генерация | ❌ пишем сами | ✅ авто-генерация |
| Скорость разработки | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐ |

⚠️ **Важно о Supabase Free tier:** бесплатный план **паузирует проект** после 7 дней без активности. При следующем запросе БД «просыпается» 30–60 секунд — пользователь видит ошибку. **Для продакшн-приложения Free tier не подходит.** Переходим сразу на Pro ($25/мес) когда запускаем Фазу 2.

**Рекомендация по переходу:**
```
Фаза 1: Vercel Serverless + Env Variables (бесплатно)
Фаза 2: + Supabase Pro $25/мес (без паузировки, auth, storage)
Фаза 3: Оценить стоимость → Supabase Pro масштабируется до $599/мес
         при критическом росте затрат — рассмотреть PocketBase (VPS)
```

### Об миграции Supabase → PocketBase

⚠️ **Честная оценка (исправление):** миграция — это отдельный спринт, не «несложная операция».

- Разные базы данных: PostgreSQL → SQLite (разные диалекты SQL)
- Разные auth-системы: нужно пересоздать учётные записи
- Разные Storage API: нужно перенести все фото
- Обновить весь клиентский код работы с API

**Когда это оправдано:** только если затраты на Supabase Pro превышают $100–150/мес и аудитория стабильна. До этого момента — не трогаем.

---

## Фаза 1 — Детальный план

> **Цель:** 5–10 дистрибьюторов, ручная настройка с помощью Валерия.
> **Бэкенд:** Vercel Serverless Functions + Vercel Environment Variables.
> **Время разработки:** 2–3 недели.

### Архитектура

```
Telegram Mini App (React SPA)
        │
        ├─ tg.initDataUnsafe.start_param → 'anna'
        │         (fallback: ?d=anna в URL)
        │
        ▼
GET /api/config?d=anna          ← Vercel Serverless Function
        │
        ├─ читает DISTRIBUTOR_ANNA из Vercel Env Variables
        ├─ проверяет поле plan: 'demo' | 'active' | 'expired'
        ├─ если expired → { error: 'expired' }
        └─ если ok → возвращает конфиг (без секретных полей)
```

### Структура конфига (Vercel Env Variable)

```json
{
  "slug": "anna",
  "plan": "active",
  "planExpiresAt": "2026-06-01",
  "specialist": {
    "name": "Анна Смирнова",
    "role": "Специалист по восстановлению здоровья",
    "photoUrl": "https://cdn.example.com/anna/photo.png",
    "fact": "5 лет практики · 150+ клиентов",
    "username": "anna_smirnova",
    "botUsername": "anna_health_bot",
    "shareText": "Прошла тест — точно описал мои симптомы. Попробуй:",
    "slotsLeft": 3
  },
  "branding": {
    "primaryColor": "#5A5A40",
    "backgroundColor": "#f5f5f0"
  },
  "socialProof": {
    "count": 0,
    "label": "человек уже разобрались"
  },
  "topics": "default",
  "testimonials": "default",
  "offer": "default"
}
```

### Что нужно построить

**Рефакторинг приложения:**
- [ ] Вынести цвета в `BRANDING` константу — убрать хардкод `#5A5A40` из App.tsx
- [ ] Вынести тексты в `TEXTS` объект — убрать хардкод строк из JSX
- [ ] Заменить «Валерий» в thankyou-экране на `SPECIALIST.name` из конфига
- [ ] Добавить React Context для конфига — все компоненты читают из него
- [ ] Удалить мёртвый код: `NEXT_STEPS`, `SPECIALIST.testimonial`
- [ ] Удалить неиспользуемые зависимости: `express`, `better-sqlite3`, `@google/genai`, `dotenv`

**Идентификация дистрибьютора:**
- [ ] Читать `tg.initDataUnsafe.start_param` как основной метод
- [ ] `?d=slug` как fallback для браузера
- [ ] Если slug не найден → показывать конфиг Валерия (`default`)

**API (Vercel Serverless Function):**
- [ ] `api/config.ts` — endpoint, читает конфиг из Env Variables, проверяет план
- [ ] Graceful degradation: если конфиг не найден → `default`, не ошибка 500

**Graceful degradation — сценарии отказа:**

| Ситуация | Поведение приложения |
|----------|---------------------|
| Slug не найден (`?d=xyz`) | Загружается конфиг `default` (Валерий) |
| Тариф истёк | Экран-заглушка: «Навигатор приостановлен. Свяжитесь с владельцем.» |
| API недоступен | Используется конфиг из localStorage-кэша (если есть) |
| localStorage-кэш пустой + API недоступен | Конфиг `default` захардкожен в коде как финальный fallback |

**Кэширование конфига:**
- [ ] При успешной загрузке конфига — сохранять в `localStorage` с TTL 24 часа
- [ ] При следующем открытии — сначала показывать кэш, потом обновлять в фоне

**Инфраструктура:**
- [ ] Папка `public/distributors/` для фотографий (или Vercel Blob Storage)
- [ ] Шаблон конфига с комментариями для быстрого заполнения новым дистрибьютором
- [ ] Инструкция: «Создай бота → настрой навигатор» (MD-файл для дистрибьютора)

**Onboarding нового дистрибьютора:**
1. Дистрибьютор заполняет форму (Google Form или Telegram)
2. Валерий (с Claude Code) создаёт JSON конфига
3. Добавляет в Vercel Environment Variables как `DISTRIBUTOR_SLUG`
4. Делает `vercel env pull` → деплой → готово
5. Даёт дистрибьютору инструкцию по BotFather

**Обновления кода:**
- Валерий делает изменения → `git push` → все дистрибьюторы получают автоматически
- Конфиги в Env Variables не затрагиваются при обновлении кода

---

## Фаза 2 — Supabase Pro

> **Триггер:** 10+ дистрибьюторов, Env Variables неудобно масштабировать.
> **Бэкенд:** Supabase Pro + Vercel Serverless Functions.

### Схема базы данных

```sql
-- Дистрибьюторы
distributors (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug            text UNIQUE NOT NULL,
  email           text UNIQUE,
  tg_user_id      bigint UNIQUE,
  plan            text DEFAULT 'demo' CHECK (plan IN ('demo','basic','pro')),
  plan_expires_at timestamptz,
  is_active       boolean DEFAULT true,
  created_at      timestamptz DEFAULT now()
)

-- Конфиги дистрибьюторов
distributor_configs (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  distributor_id  uuid REFERENCES distributors ON DELETE CASCADE,
  specialist      jsonb NOT NULL,
  branding        jsonb NOT NULL DEFAULT '{"primaryColor":"#5A5A40","backgroundColor":"#f5f5f0"}',
  social_proof    jsonb NOT NULL DEFAULT '{"count":0}',
  topics          jsonb DEFAULT '[]',        -- [] = использовать default темы
  testimonials    jsonb DEFAULT '[]',        -- [] = использовать default отзывы
  offer           jsonb DEFAULT '{}',
  updated_at      timestamptz DEFAULT now()
)

-- История подписок
subscriptions (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  distributor_id  uuid REFERENCES distributors ON DELETE CASCADE,
  plan            text NOT NULL,
  amount_rub      integer NOT NULL,
  started_at      timestamptz NOT NULL,
  expires_at      timestamptz NOT NULL,
  payment_ref     text,
  created_at      timestamptz DEFAULT now()
)
```

### API эндпоинты

```
GET  /api/config?d=slug          → конфиг (публичный, с проверкой плана)
POST /api/distributors/register  → регистрация (авторизован через Telegram)
PUT  /api/distributors/config    → обновление конфига (авторизован)
GET  /api/distributors/me        → профиль (авторизован)
POST /api/subscriptions          → создать/продлить подписку
```

### Авторизация дистрибьюторов

Telegram Login Widget — дистрибьютор нажимает «Войти через Telegram» в `/setup`.
Telegram возвращает данные с HMAC-подписью → проверяем на сервере → выдаём JWT.

⚠️ **Обязательно:** проверять подпись Telegram initData на сервере (не доверять `initDataUnsafe` без верификации). Это стандартное требование безопасности Telegram Mini App.

### Личный кабинет (`/setup`)

```
/setup        — форма: имя, роль, фото, username, слоты
/setup/preview — предпросмотр навигатора со своим конфигом
```

---

## Фаза 3 — Полноценный SaaS

> **Триггер:** 50+ дистрибьюторов, нужна автоматизация и аналитика.

- Платёжная система (Telegram Stars / ЮКасса / ЮМани)
- Автоматическое выставление счётов и блокировка при просрочке
- Аналитика: воронка по каждому дистрибьютору
- Глубокая кастомизация: темы, тексты, цвета
- Реферальная программа
- Многоязычность (украинский, английский)
- Поддомены `anna.healthnav.pro` (Vercel Pro — $20/мес, wildcard SSL)

---

## Тарифная модель

| Тариф | Цена | Что включает |
|-------|------|-------------|
| Демо | Бесплатно (30 дней) | Базовый конфиг, надпись «Powered by» |
| Базовый | 990 ₽/мес | Свой бот, полный конфиг, обновления, без «Powered by» |
| Про | 1 990 ₽/мес | + кастомные темы, отзывы, цвета, аналитика |

*Цены ориентировочные — скорректировать после первых продаж. Перед запуском монетизации проверить unit economics: затраты Supabase Pro ($25) + Vercel + поддержка = минимальный порог окупаемости.*

---

## Полный стек платформы

```
┌─────────────────────────────────────────────────────┐
│  Telegram Mini App (Frontend)                       │
│  React 19 + TypeScript + Vite + Tailwind + Motion   │
│  Идентификация: tg.initDataUnsafe.start_param       │
│  Fallback: ?d=slug (браузер)                        │
│  Кэш: localStorage с TTL 24ч                        │
│  Деплой: Vercel (auto от git push)                  │
└───────────────────┬─────────────────────────────────┘
                    │
┌───────────────────▼─────────────────────────────────┐
│  API Layer                                          │
│  Vercel Serverless Functions (TypeScript + Zod)     │
│  Фаза 1: читает Env Variables                       │
│  Фаза 2+: читает Supabase                           │
└───────────────────┬─────────────────────────────────┘
                    │
┌───────────────────▼─────────────────────────────────┐
│  Data Layer                                         │
│  Фаза 1: Vercel Environment Variables               │
│  Фаза 2: Supabase Pro                               │
│    ├── PostgreSQL (конфиги, дистрибьюторы, подписки)│
│    ├── Auth (Telegram Login Widget + JWT)           │
│    └── Storage (фото специалистов)                  │
│  Фаза 3: Оценить — при затратах >$150/мес           │
│    рассмотреть PocketBase на VPS (отдельный спринт) │
└─────────────────────────────────────────────────────┘
```

---

## Что НЕ строим сейчас (намеренно)

| Что | Почему нет |
|-----|-----------|
| Панель администратора | На 5–10 человек — Vercel Env + Claude Code быстрее |
| Автоматическая регистрация | Ручной onboarding контролирует качество на старте |
| Платёжная система | Сначала доказать ценность, потом монетизировать |
| Аналитика-дашборд | PostHog решает без собственного дашборда |
| Wildcard поддомены | Требуют Vercel Pro $20/мес — обоснованно только в Фазе 3 |
| Глубокая кастомизация цветов/тем | Минимальная кастомизация на Фазе 1 |

---

## С чего начать прямо сейчас

**Шаг 1 — Рефакторинг (1 неделя)**
Вынести цвета и тексты из App.tsx:
- Цвета → `BRANDING` константа
- Тексты → `TEXTS` константа
- «Валерий» в thankyou → `SPECIALIST.name`

**Шаг 2 — Идентификация и API (3 дня)**
- Читать `start_param` из Telegram SDK
- Написать `api/config.ts` на Vercel Serverless
- Добавить кэш конфига в localStorage

**Шаг 3 — Onboarding-инструкция (2 дня)**
- Пошаговый гайд: создать бота → заполнить форму → настроить URL → готово
- Шаблон конфига с понятными комментариями

**Шаг 4 — Тест с первым реальным дистрибьютором**
- Завести одного человека из CoralClub
- Пройти с ним весь путь
- Зафиксировать где вопросы → улучшить инструкцию

---

*Документ актуален март 2026. Обновлять по мере перехода между фазами.*
