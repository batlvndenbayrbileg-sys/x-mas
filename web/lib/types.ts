// X-MAS — multi-brand sneaker + winter store. `Category` is the brand (taxonomy
// lives in Medusa); `Shape` is the silhouette used by the fallback SVG visual.
export type Review = {
  id: string;
  product_id: string;
  name: string;
  rating: number;
  title: string | null;
  body: string;
  verified: boolean;
  created_at: string;
  /** Present on the homepage feed, so a card can link to the product. */
  product_handle?: string;
};

/** Mean rating and count over a product's approved reviews. */
export type ReviewSummary = { rating: number | null; count: number; reviews: Review[] };

export type Category =
  | "Converse" | "Nike" | "New Balance" | "ASICS" | "Salomon"
  | "UGG" | "The North Face" | "Christian Dior";
export type Shape =
  // sneakers
  | "runner" | "lowtop" | "hightop" | "chunky" | "skate" | "slide" | "trail"
  // winter footwear
  | "boot" | "slipper" | "clog" | "sneaker"
  // outerwear
  | "jacket" | "parka"
  // bags and packs — no size options, one size
  | "bag";

export type Product = {
  id: string;
  slug: string;
  name: string;
  category: Category;
  shape: Shape;
  gender: "Men" | "Women" | "Unisex";
  season: "Winter" | "Summer" | "All-Season";
  price: number;
  was?: number;
  // Ratings are NOT part of the product record — they are derived from real
  // customer reviews (see ReviewSummary), so nothing invented can be displayed.
  badge?: "Sale" | "New" | null;
  colors: string[];
  sizes: string[];
  fabric: string; // sneaker: silhouette type (Lifestyle, Running, Skate…)
  shortDesc: string;
  description: string;
  bullets: string[];
  specs: Record<string, string>;
  stock: number;
  accent: string;
  image?: string;
  images?: string[];
  variants?: { id: string; size: string; stock: number }[];
};

export type CartItem = {
  id: string;
  name: string;
  price: number;
  qty: number;
  accent: string;
  category: string;
  shape: Shape;
  image?: string;
  size?: string;
  variantId?: string;
};

export type User = { id: string; email: string; firstName: string; lastName: string; phone?: string };

export type Order = {
  id: string;
  email: string;
  items: { id: string; name: string; price: number; qty: number }[];
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  status: "processing" | "shipped" | "delivered";
  createdAt: string;
  estimatedDelivery: string;
};
