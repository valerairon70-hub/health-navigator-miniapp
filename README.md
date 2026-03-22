# Навигатор самочувствия

Telegram Mini App для wellness-консультантов. Помогает человеку за 3 шага понять, что стоит за его симптомами, и мягко подводит к консультации со специалистом.

**Продакшн:** https://mvpextracted.vercel.app
**Telegram бот:** @my_health_navigator_bot

---

## Быстрый старт

```bash
cd mvp_extracted
npm install
cp .env.example .env
npm run dev
```

Приложение доступно на http://localhost:3000

---

## Структура

```
src/
├── App.tsx        # Все экраны и навигация
├── constants.ts   # Все тексты и данные — менять здесь
├── main.tsx       # Точка входа
└── index.css      # Глобальные стили
```

---

## Переменные окружения

| Переменная | Описание |
|---|---|
| `TELEGRAM_BOT_TOKEN` | Токен бота из @BotFather — хранится в Vercel, в коде не используется (фронтенд-приложение) |
| `APP_URL` | URL приложения (`http://localhost:3000` локально, `https://mvpextracted.vercel.app` в продакшне) |
| `SUPABASE_URL` | URL проекта Supabase — нужен в Phase 2 |
| `SUPABASE_ANON_KEY` | Публичный ключ Supabase (Publishable key) — для фронтенда |
| `SUPABASE_SERVICE_ROLE_KEY` | Секретный ключ Supabase — только для серверных функций, никому не показывать |

---

## Деплой

Пуш в ветку `main` → Vercel деплоит автоматически.

```bash
git add .
git commit -m "описание изменений"
git push origin main
```

---

## Документация

| Файл | Содержание |
|------|-----------|
| `brief.md` | Полное техзадание: экраны, дизайн-система, константы |
| `PLAN.md` | Roadmap и приоритеты задач |
| `TESTING.md` | Руководство тестировщика — запуск и все тест-кейсы |
| `CLAUDE.md` | Правила работы с кодом и контекст проекта |
| `BACKEND_PLAN.md` | Архитектурный план Phase 1–3 (white-label платформа) |
| `MLM_APP_BRIEF.md` | ИКР и промт для white-label версии (для дистрибьюторов) |
