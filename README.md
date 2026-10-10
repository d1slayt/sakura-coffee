# SakuraCoffee

Сайт небольшой кофейни в духе современного японского kissaten: хвойно-зелёная
«витрина», печатное меню и крупные часы работы. Меню из PostgreSQL с поиском и фильтрами по аллергенам, бронирование стойки альтернативы с
защитой от овербукинга, форма обратной связи.

> **Концептуальный бренд для портфолио.** Адрес, часы работы и лоты кофе — демо-данные
> (на сайте это сказано прямо). Фотографии с Unsplash, иллюстративные.

**▶ Демо: https://d1slayt.github.io/sakura-coffee/**

- Дизайн-направление: [docs/design-direction.md](docs/design-direction.md)
- Архитектура, схема БД, API: [docs/architecture.md](docs/architecture.md)

![Главная — первый экран](docs/screenshots/home-hero.png)

| | |
| --- | --- |
| ![Меню на главной](docs/screenshots/home-menu.png) | ![Зал и стойка](docs/screenshots/home-room.png) |
| ![Часы работы](docs/screenshots/home-hours.png) | ![Меню: поиск и фильтры по аллергенам](docs/screenshots/menu.png) |
| ![Бронирование стойки](docs/screenshots/booking.png) | |

<p>
  <img src="docs/screenshots/mobile-home.png" alt="Мобильная версия — главная" width="260">
  <img src="docs/screenshots/mobile-nav.png" alt="Мобильная навигация" width="260">
</p>

## Две сборки из одного кода

| | Полная версия (`npm run build`) | Демо на GitHub Pages |
| --- | --- | --- |
| Меню | PostgreSQL, SQL-поиск и фильтры | те же seed-данные в бандле, фильтрация в браузере |
| Бронь и контакт | Server Actions → PostgreSQL, rate limit, защита от гонок | та же Zod-валидация и правила дат, данные никуда не отправляются |
| API `/api/*` | есть | нет (статический хостинг) |

Демо собирает workflow [.github/workflows/pages.yml](.github/workflows/pages.yml) при каждом
пуше в `main`: [scripts/prepare-pages.mjs](scripts/prepare-pages.mjs) в CI заменяет серверные
модули на версии из [demo/](demo) с теми же экспортами, затем `next build` с `output: "export"`.
Интеграционный тест [static-parity](tests/integration/static-parity.test.ts) сверяет, что браузерный
фильтр выдаёт ровно то же, что SQL-версия.

## Стек

Next.js 16.4 (App Router, Cache Components) · React 19 · TypeScript (strict) ·
Tailwind CSS 4 · PostgreSQL · Prisma 7 · Zod 4 · Motion · Lucide · Vitest · Playwright.

## Быстрый старт

Нужен Node.js 20.9+ (проверено на 24) и PostgreSQL 14+.

```bash
npm install
```

```bash
cp .env.example .env
```

Отредактируйте `.env` (см. ниже), затем:

```bash
npm run db:deploy
```

```bash
npm run db:seed
```

```bash
npm run dev
```

Сайт откроется на http://localhost:3000.

## PostgreSQL и `.env`

### Вариант А — свой PostgreSQL (Docker)

```bash
docker run -d --name sakura-db -e POSTGRES_USER=sakura -e POSTGRES_PASSWORD=sakura -e POSTGRES_DB=sakura_coffee -p 5432:5432 postgres:17
```

```dotenv
DATABASE_URL="postgresql://sakura:sakura@localhost:5432/sakura_coffee?schema=public"
RATE_LIMIT_SALT="<длинная случайная строка>"
NEXT_PUBLIC_SITE_URL="http://localhost:3000"
```

Соль можно сгенерировать так:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Вариант Б — без установки (Prisma Dev, PGlite)

```bash
npx prisma dev
```

Команда печатает строку `postgres://…`. Скопируйте её в `DATABASE_URL` и добавьте
`DATABASE_POOL_MAX=1`: PGlite выполняет все подключения в одной сессии Postgres. Этот
вариант подходит для разработки и тестов. Настоящую параллельность транзакций
проверяйте на варианте А.

## Команды

| Команда | Что делает |
| --- | --- |
| `npm run dev` | Dev-сервер |
| `npm run build` / `npm run start` | Production-сборка и запуск. **Сборке база не нужна.** |
| `npm run db:migrate` | Создать или применить миграции в разработке (`prisma migrate dev`) |
| `npm run db:deploy` | Применить миграции в production (`prisma migrate deploy`) |
| `npm run db:seed` | Заполнить меню. Идемпотентно, брони не трогает. |
| `npm run db:studio` | Prisma Studio |
| `npm run lint` | ESLint |
| `npm run typecheck` | `next typegen` и `tsc --noEmit` |
| `npm run test` | Vitest: юнит-тесты, а при наличии `DATABASE_URL` интеграционные тесты с реальной БД |
| `npm run test:e2e` | Playwright (сначала `npm run build`; один раз `npx playwright install chromium`) |
| `npm run check` | lint, typecheck и тесты |
| `npm run audit:responsive -- <url>` | Аудит вёрстки: 12 устройств (280–2560 px, Chromium + WebKit/Safari) × 5 страниц — горизонтальный скролл, вылезающие элементы, незагруженные фото |
| `npm run photos` | Скачать фото с Unsplash один раз и нарезать WebP 320/640/960/1600 в `public/photos` |

Фотографии хранятся в самом проекте (`public/photos`), а не подгружаются с CDN Unsplash:
сайт не зависит от доступности стороннего сервиса из сети посетителя, а на телефонах
загружается подходящий по ширине файл.

## Что проверено

На момент сдачи:
- `npm run lint` — без ошибок;
- `npm run typecheck` — без ошибок;
- `npm run build` — успешно, в том числе с недоступной базой;
- `npm run test` — 67/67, база через `prisma dev`;
- `npm run test:e2e` — 18 passed, 2 skipped (сценарии только для одного вьюпорта);
- миграции применены, seed выполнен и повторён (идемпотентность).

Подробности — в итоговом отчёте разработки.

## Права

© 2026 [d1slayt](https://github.com/d1slayt). **Все права защищены.** Код открыт только для
ознакомления: копирование, переработка и использование полностью или частично — только с
письменного разрешения автора. Подробно — в [LICENSE](LICENSE). Фотографии (Unsplash) и шрифты
(OFL) распространяются по собственным лицензиям.

## Ограничения

- Демо-бренд: писем не отправляется, админки нет. Брони сохраняются со статусом
  `PENDING`, сообщения — со статусом `NEW`.
- Rate limit определяет клиента по `X-Forwarded-For`. Без обратного прокси все клиенты
  попадают в один «unknown»-счётчик.
- Контент меню в БД на одном языке (русском). Словари интерфейса есть для `ru` и `en`.
- OG-картинка без текста: встроенный шрифт генератора не поддерживает кириллицу, а
  загрузка шрифта при сборке сделала бы её зависимой от сети.
