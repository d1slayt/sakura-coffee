/**
 * Where every photo came from (Unsplash, Unsplash License). The files are
 * downloaded once by `npm run photos` and served from /public/photos, so the
 * site doesn't depend on a third-party CDN at runtime.
 */
export const photoSources = {
  "hero-pour": "photo-1582768772255-7fb8066357ce",
  "philosophy-beans": "photo-1447933601403-0c6688de566e",
  "atmosphere-window": "photo-1534040385115-33dcb3acba5b",
  "atmosphere-bar": "photo-1453614512568-c4024d13c247",
  "about-kettle": "photo-1759259639356-7c6e74eed1ec",
  "visit-interior": "photo-1600093463592-8e36ae95ef56",
  "menu-espresso": "photo-1510591509098-f4fdc6d0ff04",
  "menu-flat-white": "photo-1572442388796-11668a67e53d",
  "menu-latte": "photo-1509042239860-f550ce710b93",
  "menu-filter": "photo-1551030173-122aabc4489c",
  "menu-iced-pour-over": "photo-1776510767133-accc6eadf26b",
  "menu-iced-latte": "photo-1461023058943-07fcbe16d735",
  "menu-matcha": "photo-1582793988951-9aed5509eb97",
  "menu-matcha-latte": "photo-1515823064-d6e0c04616a7",
  "menu-hojicha": "photo-1558160074-4d7d8bdf4256",
  "menu-croissant": "photo-1530610476181-d83430b64dcd",
  "menu-pastries": "photo-1515823662972-da6a2e4d3002",
  "menu-cookie": "photo-1558961363-fa8fdf82db35",
  "menu-sourdough": "photo-1509440159596-0249088772ff",
} as const;

export type PhotoKey = keyof typeof photoSources;

/** Widths generated for every photo (WebP). */
export const PHOTO_WIDTHS = [320, 640, 960, 1600] as const;

/** Public path of the largest variant; loaders swap the width suffix. */
export function photoPath(key: PhotoKey): string {
  return `/photos/${key}-1600.webp`;
}
