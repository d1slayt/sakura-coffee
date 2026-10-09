import type { Allergen, DietaryTag, MenuSection } from "@/lib/generated/prisma/enums";

/** Public, serializable view of a menu item: the contract for UI and REST. */
export interface MenuItemView {
  id: string;
  name: string;
  slug: string;
  description: string;
  priceCents: number;
  isAvailable: boolean;
  availabilityNote: string | null;
  isFeatured: boolean;
  imageUrl: string | null;
  imageAlt: string | null;
  brewNote: string | null;
  dietaryTags: DietaryTag[];
  ingredients: string[];
  allergens: Allergen[];
  category: { name: string; slug: string; section: MenuSection };
}

export interface MenuCategoryView {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  section: MenuSection;
  itemCount: number;
}

export interface MenuGroup {
  category: Omit<MenuCategoryView, "itemCount">;
  items: MenuItemView[];
}

export const ALLERGEN_ORDER: Allergen[] = ["GLUTEN", "MILK", "EGGS", "NUTS", "PEANUTS", "SOY", "SESAME", "SULPHITES"];
