/**
 * Photography registry. Every photo is from Unsplash (Unsplash License) and is
 * illustrative: none of them shows a real SakuraCoffee location. Each URL was
 * checked to resolve when the project was built.
 *
 * Keeping all photos in one place avoids reusing the same image across
 * sections by accident and keeps alt text (in the site language) consistent.
 */

export interface Photo {
  src: string;
  alt: string;
}

const unsplash = (id: string) => `https://images.unsplash.com/${id}`;

export const photos = {
  heroPour: {
    src: unsplash("photo-1582768772255-7fb8066357ce"),
    alt: "Рука держит керамическую чашку в крапинку, в неё наливают кофе из стеклянного сервировочного чайника",
  },
  storyPourOver: {
    src: unsplash("photo-1522825397800-ddf6405fc258"),
    alt: "Руки поднимают бумажный фильтр с кофе над стеклянной колбой на светлой стойке",
  },
  storyBlossom: {
    src: unsplash("photo-1522383225653-ed111181a951"),
    alt: "Бледно-розовые цветы сакуры на ветке на фоне чистого неба",
  },
  philosophyBeans: {
    src: unsplash("photo-1447933601403-0c6688de566e"),
    alt: "Крупный план кофейных зёрен средней обжарки",
  },
  philosophyEspresso: {
    src: unsplash("photo-1609050471053-8636409f9f5b"),
    alt: "Эспрессо стекает из металлического портафильтра в белую чашку",
  },
  atmosphereWindow: {
    src: unsplash("photo-1534040385115-33dcb3acba5b"),
    alt: "Деревянный столик у окна: чашка кофе, раскрытый блокнот и растение при дневном свете",
  },
  atmosphereTable: {
    src: unsplash("photo-1445116572660-236099ec97a0"),
    alt: "Маленький круглый столик у высоких окон в окружении растений",
  },
  atmosphereBar: {
    src: unsplash("photo-1453614512568-c4024d13c247"),
    alt: "Светлый кофейный бар с эспрессо-машиной, кофемолками и полками с чашками",
  },
  aboutKettle: {
    src: unsplash("photo-1759259639356-7c6e74eed1ec"),
    alt: "Бариста льёт воду из чайника с тонким носиком в белую керамическую воронку",
  },
  visitInterior: {
    src: unsplash("photo-1600093463592-8e36ae95ef56"),
    alt: "Зал кафе с деревянными стульями, подвесными растениями и стеклянной крышей",
  },
} satisfies Record<string, Photo>;

/** Menu photos, referenced by the seed script and stored on MenuItem.imageUrl. */
export const menuPhotos = {
  espresso: {
    src: unsplash("photo-1510591509098-f4fdc6d0ff04"),
    alt: "Эспрессо в белой чашке на тёмном камне, вид сверху",
  },
  flatWhite: {
    src: unsplash("photo-1572442388796-11668a67e53d"),
    alt: "Флэт уайт с рисунком-розеттой в белой чашке на блюдце, вид сверху",
  },
  latte: {
    src: unsplash("photo-1509042239860-f550ce710b93"),
    alt: "Два латте с рисунком-листом рядом с растениями в горшках",
  },
  filter: {
    src: unsplash("photo-1551030173-122aabc4489c"),
    alt: "Чашка чёрного фильтр-кофе на краю деревянного стола",
  },
  icedPourOver: {
    src: unsplash("photo-1776510767133-accc6eadf26b"),
    alt: "Пуровер, заваренный на лёд, рядом с воронкой, вид сверху",
  },
  icedLatte: {
    src: unsplash("photo-1461023058943-07fcbe16d735"),
    alt: "Айс латте: молоко закручивается в кофе в высоком стакане",
  },
  matcha: {
    src: unsplash("photo-1582793988951-9aed5509eb97"),
    alt: "Чаша взбитой матчи рядом с бамбуковым венчиком и порошком матчи на дереве",
  },
  matchaLatte: {
    src: unsplash("photo-1515823064-d6e0c04616a7"),
    alt: "Матча латте с рисунком-листом в белой чашке",
  },
  hojicha: {
    src: unsplash("photo-1558160074-4d7d8bdf4256"),
    alt: "Глиняный чайник и стакан обжаренного чая на деревянном подносе",
  },
  croissant: {
    src: unsplash("photo-1530610476181-d83430b64dcd"),
    alt: "Поднос с золотистыми круассанами",
  },
  pastries: {
    src: unsplash("photo-1515823662972-da6a2e4d3002"),
    alt: "Выпечка вокруг чашки латте на тёмном столе, вид сверху",
  },
  cookie: {
    src: unsplash("photo-1558961363-fa8fdf82db35"),
    alt: "Печенье с кусочками шоколада в миске, выстеленной бумагой",
  },
  sourdough: {
    src: unsplash("photo-1509440159596-0249088772ff"),
    alt: "Буханки хлеба на закваске с семечками и колос пшеницы",
  },
} as const;
