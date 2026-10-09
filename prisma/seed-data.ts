import type { Allergen, DietaryTag, MenuSection } from "../lib/generated/prisma/client";
import { menuPhotos } from "../lib/images";

/**
 * Демонстрационное меню концептуального бренда SakuraCoffee. Лоты кофе
 * описаны обобщённо («мытый лот из Восточной Африки»), без названий реальных
 * ферм и импортёров. Данные об аллергенах иллюстративные.
 * Цены хранятся в копейках (priceCents), чтобы не работать с дробными деньгами.
 */

const rub = (roubles: number) => roubles * 100;

export const ingredients: { name: string; allergens: Allergen[] }[] = [
  { name: "Эспрессо", allergens: [] },
  { name: "Фильтр-кофе", allergens: [] },
  { name: "Молоко", allergens: ["MILK"] },
  { name: "Овсяное молоко", allergens: ["GLUTEN"] },
  { name: "Лёд", allergens: [] },
  { name: "Тоник", allergens: [] },
  { name: "Апельсиновая цедра", allergens: [] },
  { name: "Сироп из цветов сакуры", allergens: [] },
  { name: "Матча", allergens: [] },
  { name: "Ходзича", allergens: [] },
  { name: "Пшеничная мука", allergens: ["GLUTEN"] },
  { name: "Сливочное масло", allergens: ["MILK"] },
  { name: "Яйца", allergens: ["EGGS"] },
  { name: "Сахар", allergens: [] },
  { name: "Тёмный шоколад", allergens: ["MILK", "SOY"] },
  { name: "Чёрный кунжут", allergens: ["SESAME"] },
  { name: "Миндальная мука", allergens: ["NUTS"] },
  { name: "Морская соль", allergens: [] },
  { name: "Хлеб на закваске", allergens: ["GLUTEN"] },
  { name: "Семечки (подсолнечник, тыква, кунжут)", allergens: ["SESAME"] },
  { name: "Культурное сливочное масло", allergens: ["MILK"] },
  { name: "Молочный хлеб", allergens: ["GLUTEN", "MILK", "EGGS"] },
  { name: "Японский майонез", allergens: ["EGGS", "SULPHITES"] },
  { name: "Зелёный лук", allergens: [] },
  { name: "Авокадо", allergens: [] },
  { name: "Лимон", allergens: [] },
  { name: "Хлопья чили", allergens: [] },
  { name: "Овсяные хлопья", allergens: ["GLUTEN"] },
  { name: "Кокосовый йогурт", allergens: [] },
  { name: "Томлёная груша", allergens: [] },
  { name: "Обжаренный фундук", allergens: ["NUTS"] },
];

export const categories: {
  slug: string;
  name: string;
  section: MenuSection;
  description: string;
}[] = [
  {
    slug: "espresso",
    name: "Эспрессо-бар",
    section: "DRINK",
    description: "Домашний бленд по рецепту, который мы проверяем каждое утро. Овсяное молоко — без доплаты.",
  },
  {
    slug: "filter",
    name: "Альтернатива",
    section: "DRINK",
    description: "Завариваем вручную, по одной чашке. Дайте ей четыре минуты.",
  },
  {
    slug: "tea",
    name: "Чай",
    section: "DRINK",
    description: "Японский зелёный и обжаренный чай — взбиваем или завариваем под заказ.",
  },
  {
    slug: "cold",
    name: "Холодное",
    section: "DRINK",
    description: "Для тёплых дней.",
  },
  {
    slug: "bakery",
    name: "Выпечка",
    section: "FOOD",
    description: "Печём каждое утро небольшими партиями. Закончилось — значит, закончилось.",
  },
  {
    slug: "kitchen",
    name: "Кухня",
    section: "FOOD",
    description: "Короткое меню, до 14:00.",
  },
];

export interface SeedItem {
  slug: string;
  name: string;
  category: string;
  priceCents: number;
  description: string;
  ingredients: string[];
  dietaryTags: DietaryTag[];
  brewNote?: string;
  image?: { src: string; alt: string };
  isFeatured?: boolean;
  isAvailable?: boolean;
  availabilityNote?: string;
}

export const items: SeedItem[] = [
  // Эспрессо-бар
  {
    slug: "espresso",
    name: "Эспрессо",
    category: "espresso",
    priceCents: rub(200),
    description: "Двойной шот домашнего бленда. Какао, сушёная слива, короткое чистое послевкусие.",
    ingredients: ["Эспрессо"],
    dietaryTags: ["VEGAN"],
    brewNote: "18 г на входе · 36 г на выходе · 28 с",
    image: menuPhotos.espresso,
  },
  {
    slug: "cortado",
    name: "Кортадо",
    category: "espresso",
    priceCents: rub(240),
    description: "Эспрессо и равная часть тёплого молока. Маленький, крепкий, округлый.",
    ingredients: ["Эспрессо", "Молоко"],
    dietaryTags: ["VEGAN_OPTION"],
    brewNote: "Стакан 120 мл",
  },
  {
    slug: "flat-white",
    name: "Флэт уайт",
    category: "espresso",
    priceCents: rub(290),
    description: "Два ристретто под тонким слоем шелковистого молока. Его чаще всего заказывают наши постоянные гости.",
    ingredients: ["Эспрессо", "Молоко"],
    dietaryTags: ["VEGAN_OPTION"],
    brewNote: "Чашка 160 мл · молоко 60 °C",
    image: menuPhotos.flatWhite,
    isFeatured: true,
  },
  {
    slug: "latte",
    name: "Латте",
    category: "espresso",
    priceCents: rub(310),
    description: "Чашка подлиннее и помягче: эспрессо и много взбитого молока.",
    ingredients: ["Эспрессо", "Молоко"],
    dietaryTags: ["VEGAN_OPTION"],
    brewNote: "Чашка 240 мл",
    image: menuPhotos.latte,
  },
  {
    slug: "hanami-latte",
    name: "Ханами латте",
    category: "espresso",
    priceCents: rub(380),
    description:
      "Наш весенний напиток: эспрессо, овсяное молоко и сироп, который мы варим из солёных цветов сакуры. Цветочный, чуть солоноватый, не сладкий.",
    ingredients: ["Эспрессо", "Овсяное молоко", "Сироп из цветов сакуры"],
    dietaryTags: ["VEGAN"],
    brewNote: "Только весной",
    isFeatured: true,
    isAvailable: false,
    availabilityNote: "Вернётся весной, вместе с цветами.",
  },
  // Альтернатива
  {
    slug: "filter-of-the-week",
    name: "Фильтр недели",
    category: "filter",
    priceCents: rub(350),
    description:
      "Моносорт, который меняется каждую неделю, — завариваем вручную. На этой неделе (концептуальный пример): мытый лот из Восточной Африки с нотами бергамота и чёрного чая.",
    ingredients: ["Фильтр-кофе"],
    dietaryTags: ["VEGAN"],
    brewNote: "Kalita Wave · 15 г : 250 г · 93 °C",
    image: menuPhotos.filter,
    isFeatured: true,
  },
  {
    slug: "batch-brew",
    name: "Батч-брю",
    category: "filter",
    priceCents: rub(220),
    description: "Сегодняшний фильтр, сваренный большой партией, — когда нет четырёх минут.",
    ingredients: ["Фильтр-кофе"],
    dietaryTags: ["VEGAN"],
    brewNote: "Повтор — 100 ₽",
  },
  {
    slug: "iced-pour-over",
    name: "Пуровер со льдом",
    category: "cold",
    priceCents: rub(360),
    description:
      "Завариваем горячим прямо на лёд, по-японски. Кофе остывает за секунды и сохраняет ароматы, которые теряет колд-брю.",
    ingredients: ["Фильтр-кофе", "Лёд"],
    dietaryTags: ["VEGAN"],
    brewNote: "Половина воды — лёд",
    image: menuPhotos.icedPourOver,
  },
  // Чай
  {
    slug: "ceremonial-matcha",
    name: "Церемониальная матча",
    category: "tea",
    priceCents: rub(380),
    description: "Зелёный чай каменного помола, взбиваем при вас и подаём в чаше. Травянистый, сладковатый, с лёгкой горчинкой.",
    ingredients: ["Матча"],
    dietaryTags: ["VEGAN"],
    brewNote: "2 г · 70 мл · 75 °C",
    image: menuPhotos.matcha,
    isFeatured: true,
  },
  {
    slug: "matcha-latte",
    name: "Матча латте",
    category: "tea",
    priceCents: rub(390),
    description: "Взбитая матча с горячим молоком. Можно со льдом.",
    ingredients: ["Матча", "Молоко"],
    dietaryTags: ["VEGAN_OPTION"],
    image: menuPhotos.matchaLatte,
  },
  {
    slug: "hojicha-pot",
    name: "Ходзича, чайник на одного",
    category: "tea",
    priceCents: rub(330),
    description: "Обжаренный зелёный чай с нотами тоста и карамели и совсем небольшим количеством кофеина. Хорош после 15:00.",
    ingredients: ["Ходзича"],
    dietaryTags: ["VEGAN"],
    brewNote: "Две заварки",
    image: menuPhotos.hojicha,
  },
  {
    slug: "hojicha-latte",
    name: "Ходзича латте",
    category: "tea",
    priceCents: rub(350),
    description: "Обжаренный чай и горячее молоко — наш осенний любимец.",
    ingredients: ["Ходзича", "Молоко"],
    dietaryTags: ["VEGAN_OPTION"],
  },
  // Холодное
  {
    slug: "iced-latte",
    name: "Айс латте",
    category: "cold",
    priceCents: rub(330),
    description: "Двойной шот на холодном молоке со льдом.",
    ingredients: ["Эспрессо", "Молоко", "Лёд"],
    dietaryTags: ["VEGAN_OPTION"],
    image: menuPhotos.icedLatte,
  },
  {
    slug: "espresso-tonic",
    name: "Эспрессо-тоник",
    category: "cold",
    priceCents: rub(360),
    description: "Эспрессо поверх тоника со льдом и апельсиновой цедрой. Горьковатый, яркий, с пузырьками.",
    ingredients: ["Эспрессо", "Тоник", "Лёд", "Апельсиновая цедра"],
    dietaryTags: ["VEGAN"],
  },
  // Выпечка
  {
    slug: "butter-croissant",
    name: "Круассан на сливочном масле",
    category: "bakery",
    priceCents: rub(250),
    description: "Слоим два дня на культурном сливочном масле. Лучше всего до 11:00.",
    ingredients: ["Пшеничная мука", "Культурное сливочное масло", "Яйца", "Сахар", "Морская соль"],
    dietaryTags: ["VEGETARIAN"],
    image: menuPhotos.croissant,
    isFeatured: true,
  },
  {
    slug: "pain-au-chocolat",
    name: "Пэн-о-шоколя",
    category: "bakery",
    priceCents: rub(280),
    description: "Круассанное тесто вокруг двух палочек тёмного шоколада.",
    ingredients: ["Пшеничная мука", "Культурное сливочное масло", "Тёмный шоколад", "Яйца", "Сахар"],
    dietaryTags: ["VEGETARIAN"],
    image: menuPhotos.pastries,
  },
  {
    slug: "black-sesame-cookie",
    name: "Печенье с чёрным кунжутом",
    category: "bakery",
    priceCents: rub(190),
    description: "Тягучее, ореховое, едва сладкое, с хлопьями соли сверху.",
    ingredients: ["Пшеничная мука", "Сливочное масло", "Чёрный кунжут", "Сахар", "Яйца", "Морская соль"],
    dietaryTags: ["VEGETARIAN"],
  },
  {
    slug: "chocolate-chip-cookie",
    name: "Печенье с шоколадом и топлёным маслом",
    category: "bakery",
    priceCents: rub(190),
    description: "Топлёное масло, тёмный шоколад, щепотка соли.",
    ingredients: ["Пшеничная мука", "Сливочное масло", "Тёмный шоколад", "Сахар", "Яйца", "Морская соль"],
    dietaryTags: ["VEGETARIAN"],
    image: menuPhotos.cookie,
  },
  {
    slug: "matcha-financier",
    name: "Финансье с матчей",
    category: "bakery",
    priceCents: rub(220),
    description: "Маленькое миндальное пирожное на топлёном масле с матчей.",
    ingredients: ["Миндальная мука", "Сливочное масло", "Яйца", "Сахар", "Матча", "Пшеничная мука"],
    dietaryTags: ["VEGETARIAN"],
  },
  // Кухня
  {
    slug: "seeded-sourdough-toast",
    name: "Тост на закваске с семечками",
    category: "kitchen",
    priceCents: rub(320),
    description: "Два толстых ломтя с культурным сливочным маслом и морской солью.",
    ingredients: ["Хлеб на закваске", "Семечки (подсолнечник, тыква, кунжут)", "Культурное сливочное масло", "Морская соль"],
    dietaryTags: ["VEGETARIAN"],
    image: menuPhotos.sourdough,
  },
  {
    slug: "tamago-sando",
    name: "Тамаго сандо",
    category: "kitchen",
    priceCents: rub(490),
    description: "Нежный яичный салат в молочном хлебе без корок, с зелёным луком.",
    ingredients: ["Молочный хлеб", "Яйца", "Японский майонез", "Зелёный лук"],
    dietaryTags: ["VEGETARIAN"],
  },
  {
    slug: "avocado-on-sourdough",
    name: "Авокадо на закваске",
    category: "kitchen",
    priceCents: rub(540),
    description: "Размятое авокадо, лимон, чили и семечки на поджаренном хлебе на закваске.",
    ingredients: ["Хлеб на закваске", "Авокадо", "Лимон", "Хлопья чили", "Семечки (подсолнечник, тыква, кунжут)"],
    dietaryTags: ["VEGAN"],
  },
  {
    slug: "overnight-oats",
    name: "Ночная овсянка",
    category: "kitchen",
    priceCents: rub(420),
    description: "Овсянка, настоянная за ночь на овсяном молоке, с кокосовым йогуртом, томлёной грушей и обжаренным фундуком.",
    ingredients: ["Овсяные хлопья", "Овсяное молоко", "Кокосовый йогурт", "Томлёная груша", "Обжаренный фундук"],
    dietaryTags: ["VEGAN"],
  },
];
