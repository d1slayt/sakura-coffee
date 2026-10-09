import { photoPath } from "./photo-sources";

/**
 * Photography registry. Every photo is from Unsplash (Unsplash License) and is
 * illustrative: none of them shows a real SakuraCoffee location. Files are
 * self-hosted in /public/photos (see lib/photo-sources.ts) so images never
 * depend on a third-party CDN being reachable from the visitor's network.
 *
 * Keeping all photos in one place avoids reusing the same image across
 * sections by accident and keeps alt text (in the site language) consistent.
 */

export interface Photo {
  src: string;
  alt: string;
}

export const photos = {
  heroPour: {
    src: photoPath("hero-pour"),
    alt: "Рука держит керамическую чашку в крапинку, в неё наливают кофе из стеклянного сервировочного чайника",
  },
  storyPourOver: {
    src: photoPath("story-pour-over"),
    alt: "Руки поднимают бумажный фильтр с кофе над стеклянной колбой на светлой стойке",
  },
  storyBlossom: {
    src: photoPath("story-blossom"),
    alt: "Бледно-розовые цветы сакуры на ветке на фоне чистого неба",
  },
  philosophyBeans: {
    src: photoPath("philosophy-beans"),
    alt: "Крупный план кофейных зёрен средней обжарки",
  },
  philosophyEspresso: {
    src: photoPath("philosophy-espresso"),
    alt: "Эспрессо стекает из металлического портафильтра в белую чашку",
  },
  atmosphereWindow: {
    src: photoPath("atmosphere-window"),
    alt: "Деревянный столик у окна: чашка кофе, раскрытый блокнот и растение при дневном свете",
  },
  atmosphereTable: {
    src: photoPath("atmosphere-table"),
    alt: "Маленький круглый столик у высоких окон в окружении растений",
  },
  atmosphereBar: {
    src: photoPath("atmosphere-bar"),
    alt: "Светлый кофейный бар с эспрессо-машиной, кофемолками и полками с чашками",
  },
  aboutKettle: {
    src: photoPath("about-kettle"),
    alt: "Бариста льёт воду из чайника с тонким носиком в белую керамическую воронку",
  },
  visitInterior: {
    src: photoPath("visit-interior"),
    alt: "Зал кафе с деревянными стульями, подвесными растениями и стеклянной крышей",
  },
} satisfies Record<string, Photo>;

/** Menu photos, referenced by the seed script and stored on MenuItem.imageUrl. */
export const menuPhotos = {
  espresso: {
    src: photoPath("menu-espresso"),
    alt: "Эспрессо в белой чашке на тёмном камне, вид сверху",
  },
  flatWhite: {
    src: photoPath("menu-flat-white"),
    alt: "Флэт уайт с рисунком-розеттой в белой чашке на блюдце, вид сверху",
  },
  latte: {
    src: photoPath("menu-latte"),
    alt: "Два латте с рисунком-листом рядом с растениями в горшках",
  },
  filter: {
    src: photoPath("menu-filter"),
    alt: "Чашка чёрного фильтр-кофе на краю деревянного стола",
  },
  icedPourOver: {
    src: photoPath("menu-iced-pour-over"),
    alt: "Пуровер, заваренный на лёд, рядом с воронкой, вид сверху",
  },
  icedLatte: {
    src: photoPath("menu-iced-latte"),
    alt: "Айс латте: молоко закручивается в кофе в высоком стакане",
  },
  matcha: {
    src: photoPath("menu-matcha"),
    alt: "Чаша взбитой матчи рядом с бамбуковым венчиком и порошком матчи на дереве",
  },
  matchaLatte: {
    src: photoPath("menu-matcha-latte"),
    alt: "Матча латте с рисунком-листом в белой чашке",
  },
  hojicha: {
    src: photoPath("menu-hojicha"),
    alt: "Глиняный чайник и стакан обжаренного чая на деревянном подносе",
  },
  croissant: {
    src: photoPath("menu-croissant"),
    alt: "Поднос с золотистыми круассанами",
  },
  pastries: {
    src: photoPath("menu-pastries"),
    alt: "Выпечка вокруг чашки латте на тёмном столе, вид сверху",
  },
  cookie: {
    src: photoPath("menu-cookie"),
    alt: "Печенье с кусочками шоколада в миске, выстеленной бумагой",
  },
  sourdough: {
    src: photoPath("menu-sourdough"),
    alt: "Буханки хлеба на закваске с семечками и колос пшеницы",
  },
} as const;
