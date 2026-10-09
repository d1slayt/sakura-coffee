# SakuraCoffee — архитектура

## Стек

| Слой | Технология | Почему |
| --- | --- | --- |
| Фреймворк | Next.js 16.4 (App Router, Turbopack, **Cache Components + Partial Prefetching**) | Server Components по умолчанию, частичный пререндер: статичный каркас страницы отдаётся сразу, данные из БД стримятся. |
| Язык | TypeScript 5 (strict) | Сквозная типизация от схемы БД до UI. |
| Стили | Tailwind CSS 4 (`@theme`-токены в `app/globals.css`) | Все цвета, отступы, шрифты и кривые анимации — токены; компоненты не задают свои значения. |
| БД | PostgreSQL + Prisma 7.10 (генератор `prisma-client`, драйвер-адаптер `@prisma/adapter-pg`) | Нормализованная схема, миграции, типобезопасные запросы. |
| Валидация | Zod 4 | Одна схема — один источник правды для Server Actions и API. |
| Анимации | Motion 14 | Только появление блоков, мобильное меню и смена превью. |
| Иконки | Lucide React | |
| Тесты | Vitest 5 (юнит + интеграция с реальной БД), Playwright 1.64 (e2e, десктоп + мобильный) | |

Отдельный backend-фреймворк не используется: Route Handlers и Server Actions покрывают все сценарии.

## Структура

```
app/
  layout.tsx, page.tsx              главная, шрифты, метаданные
  menu/page.tsx, menu/[slug]/       меню с поиском/фильтрами, карточка позиции
  about/, visit/                    история; визит + формы
  not-found.tsx, error.tsx, global-error.tsx
  api/menu/categories|items|items/[slug]   REST (чтение меню)
  api/reservations/availability     свободные места
  api/health                        liveness + проверка БД
  robots.ts, sitemap.ts, manifest.ts, icon.svg, apple-icon.tsx, opengraph-image.tsx
components/
  layout/    шапка, навигация (+ чистый NavLinksView), мобильное меню, подвал, статус «открыто»
  sections/  секции главной
  menu/      строки меню, фильтры (client), избранное (client)
  forms/     формы брони и контакта (client), поля, honeypot
  ui/        Action (кнопки/ссылки), Photo, Reveal, BlossomMark, Logo, DataBoundary
lib/
  i18n/      словари ru (основной) и en, тип Dictionary
  validations/  Zod-схемы
  db/        Prisma-клиент (ленивый), классификация ошибок
  booking.ts, time.ts, opening.ts   чистая доменная логика (тестируется без БД)
  site.ts, images.ts, utils.ts
server/
  menu.ts          запросы меню (без кэша) + кэшируемые обёртки для страниц
  reservations.ts  доступность и создание брони (транзакция)
  contact.ts       сохранение сообщений
  actions.ts       Server Actions форм
  rate-limit.ts, form-guard.ts, http.ts
prisma/  schema.prisma, migrations/, seed.ts, seed-data.ts
tests/   unit/, integration/, e2e/
```

## Рендеринг и кэширование

- Всё, что не зависит от данных (тексты, фото, сетка), пререндерится при сборке.
- Блоки с данными из БД (избранное, меню, карточка позиции) рендерятся внутри
  `<Suspense>` и вызывают `connection()`. Поэтому **production build не обращается к
  базе**: проверено сборкой с недоступным `DATABASE_URL`.
- Страницы читают меню через функции с `"use cache"`, `cacheLife("minutes")` и
  `cacheTag("menu")`. Будущая админка сможет сбросить кэш через `revalidateTag("menu")`.
- REST API вызывает те же запросы **без** `use cache` и кэшируется HTTP-заголовками
  (`s-maxage`, `stale-while-revalidate`). Причина: ошибка внутри кэшируемой функции
  приходит сериализованной и теряет код, а API должен отличать «БД недоступна» (503)
  от прочих ошибок (500). Логика запросов не дублируется: обёртки вызывают `menuQueries`.
- Клиентские компоненты с `usePathname()` (навигация) обёрнуты в `<Suspense>` со
  статическим fallback (`NavLinksView`). Иначе маршруты с динамическими параметрами
  не смогли бы пререндериться.

## Схема БД

```
MenuCategory 1─* MenuItem *─* Ingredient      (через MenuItemIngredient, с position)
Reservation                                   (бронь стойки альтернативы)
ContactMessage
RateLimitBucket                               (счётчики rate limit)
```

- **MenuItem:**
  - цена в копейках (`priceCents Int`);
  - уникальный `slug`;
  - `isAvailable` и `availabilityNote` («вернётся весной»), `isFeatured`;
  - `imageUrl` и `imageAlt`, `dietaryTags DietaryTag[]`, `brewNote`;
  - `createdAt` и `updatedAt`;
  - индексы `(categoryId, sortOrder)`, `isFeatured`, `isAvailable`.
- **Аллергены принадлежат ингредиентам** (`Ingredient.allergens Allergen[]`), у позиции
  они вычисляются. Фильтр «без молока» — реляционный запрос
  `ingredients: { none: { ingredient: { allergens: { has: "MILK" } } } }`, данные
  не дублируются.
- **Reservation:**
  - уникальный `reference` (SC-XXXXXX);
  - `slotStart timestamptz` в UTC;
  - `status` по умолчанию `PENDING` (клиент статус задать не может: в Zod-схеме этого поля нет);
  - индексы `(slotStart, status)` и `(email, slotStart)`.
- **ContactMessage:** `topic` — enum, `status` по умолчанию `NEW`.
- **RateLimitBucket:** ключ — `действие:sha256(ip + соль)`. Сырые IP не хранятся.

## API

| Метод и путь | Что делает | Ответы |
| --- | --- | --- |
| `GET /api/menu/categories` | Категории в порядке меню с количеством позиций | 200, 503 |
| `GET /api/menu/items?q=&category=&diet=&free=&available=1` | Поиск (название, описание, ингредиенты; без учёта регистра) и фильтры. Неизвестные параметры игнорируются. | 200, 503 |
| `GET /api/menu/items/:slug` | Одна позиция с составом и вычисленными аллергенами | 200, 400, 404, 503 |
| `GET /api/reservations/availability?date=YYYY-MM-DD` | Свободные места по сессиям или причина, почему дата недоступна | 200, 400, 429, 503 |
| `GET /api/health` | Проверка БД | 200, 503 |

Формат: `{ data }` или `{ error: { code, message, details? } }`. Внутренние ошибки только
логируются: класс и код ошибки, без персональных данных и без текста драйвера в production.

## Server Actions

- `submitReservation` и `submitContact` (`server/actions.ts`) подключены через `useActionState`.
- Работают и без JavaScript: у формы есть `action`, ответ приходит обычной отправкой.
- С JavaScript форма отправляется в transition без сброса, чтобы введённые значения
  сохранялись при ошибках.

Порядок проверок:
1. Защита от ботов: honeypot-поле `website` и `startedAt` (отправка быстрее 2,5 с считается ботом).
   - Без JS `startedAt` пуст, и проверка времени пропускается.
   - Ботам отвечаем «успехом», но ничего не сохраняем.
2. Zod-валидация, ошибки по полям, сообщения из словаря.
3. Rate limit: бронь и контакт — 5 в час, availability — 120 за 10 минут на хэш IP.
   - Счётчик — атомарный `INSERT … ON CONFLICT DO UPDATE` в Postgres.
   - Работает между несколькими инстансами.
4. Бизнес-правила и запись.

## Бронирование и конкурентность

Правила (`lib/booking.ts`):
- шесть мест, сессии по 45 минут: 09, 10, 11, 13, 14, 15 часов;
- от 1 до 4 гостей в брони;
- бронирование с завтрашнего дня и не дальше чем на 30 дней;
- понедельник закрыт;
- «сегодня» считается во времени кофейни (`Europe/Moscow`), а не сервера.

Создание брони (`server/reservations.ts`) — одна транзакция:
1. `pg_advisory_xact_lock` на ключ слота: конкурирующие запросы на одну сессию выстраиваются в очередь.
2. Подсчёт занятых мест и проверка дубля (тот же email на ту же сессию).
3. Вставка.

Транзакция идёт в изоляции **SERIALIZABLE**. Если блокировку когда-нибудь обойдут,
Postgres прервёт конфликтующую транзакцию, и она повторится до 4 раз. Интеграционный
тест отправляет 5 параллельных броней по 2 места на сессию из 6 мест и проверяет, что
прошли ровно 3.

## Обработка ошибок

| Уровень | Механизм |
| --- | --- |
| Блоки с данными | `DataBoundary` (`catchError` из `next/error`): спокойное сообщение «Меню отдыхает» и кнопка повтора. Остальная страница работает. |
| Маршрут | `app/error.tsx` (`retry()`), `app/global-error.tsx` |
| API | `handleRouteError`: 503 при недоступной БД (P1001, P1017, `DriverAdapterError` вида `DatabaseNotReachable` и т. д.), иначе 500. Детали не раскрываются. |
| Формы | понятные сообщения; при недоступной БД «попробуйте через несколько минут» |
| Метаданные | `generateMetadata` ловит ошибки, чтобы не ронять страницу |

## Окружение

| Переменная | Назначение |
| --- | --- |
| `DATABASE_URL` | PostgreSQL |
| `DATABASE_POOL_MAX` | Размер пула. `1` для `prisma dev` (PGlite выполняет все подключения в одной сессии). Для настоящего Postgres не задавать. |
| `RATE_LIMIT_SALT` | Соль для хэширования IP |
| `NEXT_PUBLIC_SITE_URL` | Канонический URL (метаданные, sitemap, JSON-LD) |

## Безопасность

- Zod на сервере для всех входов; клиентская валидация не используется как гарантия.
- Нет публичного CRUD меню: меню меняется только через seed или миграции.
- Статусы брони и сообщений задаёт только сервер.
- Секреты только в `.env` (в `.gitignore`); `.env.example` без реальных значений.
- Заголовки: `X-Content-Type-Options`, `Referrer-Policy`, `X-Frame-Options: DENY`,
  `Permissions-Policy`; `poweredByHeader: false`.
- Удалённые изображения ограничены `images.unsplash.com/photo-**`, `maximumRedirects: 0`,
  allow-list качеств `[70, 80]`.
- JSON-LD экранирует `<`. В Schema.org нет выдуманных адреса, координат, телефона и рейтингов.

## i18n

- Все строки UI, включая сообщения валидации и Server Actions, лежат в
  `lib/i18n/dictionaries/{ru,en}.ts` под общим типом `Dictionary`.
- Компоненты читают только словарь. Русский — основной язык, английский словарь полный.
- Чтобы отдавать оба языка, нужны сегмент `app/[lang]` и передача локали в `getDictionary`.
- Контент меню в БД хранится на одном языке. Для второго понадобятся таблицы переводов.
