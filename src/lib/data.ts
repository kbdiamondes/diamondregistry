import { Product, Category } from "./types";

// Mock data for development — replace with Supabase queries in production
export const mockCategories: Category[] = [
  { id: "1", name: "Kitchen", sort_order: 1 },
  { id: "2", name: "Living Room", sort_order: 2 },
  { id: "3", name: "Bedroom", sort_order: 3 },
  { id: "4", name: "Outdoor", sort_order: 4 },
];

export const mockProducts: Product[] = [
  {
    id: "1",
    name: "Le Creuset Dutch Oven",
    description:
      "5.5 quart enameled cast iron in Flame. Perfect for slow-cooked meals andSunday roasts.",
    price: "$370",
    image_url: "https://picsum.photos/seed/dutchoven/400/400",
    external_link: "https://www.lecreuset.com",
    category: "Kitchen",
    is_claimed: false,
    claimed_by_real: null,
    claimed_by_display: null,
    claimed_at: null,
    created_at: "2026-08-01T00:00:00Z",
  },
  {
    id: "2",
    name: "KitchenAid Stand Mixer",
    description:
      "Artisan 5-quart tilt-head stand mixer in Matte Black. A kitchen staple.",
    price: "$450",
    image_url: "https://picsum.photos/seed/mixer/400/400",
    external_link: "https://www.kitchenaid.com",
    category: "Kitchen",
    is_claimed: true,
    claimed_by_real: "John Doe",
    claimed_by_display: "J*** D**",
    claimed_at: "2026-08-10T14:30:00Z",
    created_at: "2026-08-01T00:00:00Z",
  },
  {
    id: "3",
    name: "Linen Throw Blanket",
    description:
      "Stonewashed Belgian linen in oatmeal. Softens with every wash.",
    price: "$120",
    image_url: "https://picsum.photos/seed/blanket/400/400",
    external_link: "",
    category: "Living Room",
    is_claimed: false,
    claimed_by_real: null,
    claimed_by_display: null,
    claimed_at: null,
    created_at: "2026-08-01T00:00:00Z",
  },
  {
    id: "4",
    name: "Ceramic Vase Set",
    description:
      "Set of 3 handmade stoneware vases in muted earth tones. Each one is unique.",
    price: "$85",
    image_url: "https://picsum.photos/seed/vases/400/400",
    external_link: "",
    category: "Living Room",
    is_claimed: true,
    claimed_by_real: "Maria Clara Santos",
    claimed_by_display: "M**** C**** S*****",
    claimed_at: "2026-08-11T09:15:00Z",
    created_at: "2026-08-01T00:00:00Z",
  },
  {
    id: "5",
    name: "Organic Cotton Sheet Set",
    description:
      "Queen-size percale sheets in fog grey. 300 thread count, breathable weave.",
    price: "$210",
    image_url: "https://picsum.photos/seed/sheets/400/400",
    external_link: "https://www.brooklinen.com",
    category: "Bedroom",
    is_claimed: false,
    claimed_by_real: null,
    claimed_by_display: null,
    claimed_at: null,
    created_at: "2026-08-01T00:00:00Z",
  },
  {
    id: "6",
    name: "Cast Iron Fire Pit",
    description:
      "26-inch round fire pit with cooking grate. For evenings under the stars.",
    price: "$290",
    image_url: "https://picsum.photos/seed/firepit/400/400",
    external_link: "",
    category: "Outdoor",
    is_claimed: false,
    claimed_by_real: null,
    claimed_by_display: null,
    claimed_at: null,
    created_at: "2026-08-01T00:00:00Z",
  },
];

/**
 * Redact a name: first character visible, rest replaced with *
 * Single-character names stay as-is.
 */
export function redactName(firstName: string, lastName: string): string {
  const redactWord = (word: string): string => {
    if (word.length <= 1) return word;
    return word[0] + "*".repeat(word.length - 1);
  };
  return `${redactWord(firstName)} ${redactWord(lastName)}`;
}
