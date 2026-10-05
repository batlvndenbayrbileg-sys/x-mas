// X-MAS — multi-brand sneaker + winter store. `Category` is the brand (taxonomy
// lives in Medusa); `Shape` is the silhouette used by the fallback SVG visual.
export type Category = "Converse" | "New Balance" | "UGG" | "The North Face";
export type Shape =
  // sneakers (Converse / New Balance)
  | "runner" | "lowtop" | "hightop" | "chunky" | "skate" | "slide"
  // UGG footwear
  | "boot" | "slipper" | "clog" | "sneaker"
  // The North Face outerwear
  | "jacket" | "parka";

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
  rating: number;
  reviews: number;
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
