import type { Category, Shape } from "./types";

/**
 * Presentation metadata keyed by Medusa product handle.
 * Medusa is the source of truth for catalog, price, image and availability;
 * these fields enrich the storefront UX (accent, rating, badge, specs).
 */
export type Enrich = {
  category: Category;
  shape: Shape;
  gender: "Men" | "Women" | "Unisex";
  season: "Winter" | "Summer" | "All-Season";
  accent: string;
  fabric: string; // sneaker type: Canvas, Suede, Retro, Platform, Running
  colors: string[];
  bullets: string[];
  specs: Record<string, string>;
  rating: number;
  reviews: number;
  badge?: "Sale" | "New" | null;
  wasMultiplier?: number; // original price = price * multiplier
};

// Generic copy keyed by sneaker type — keeps 30 entries concise.
const BULLETS: Record<string, string[]> = {
  Canvas: ["Оригинал Converse", "Даавуун гадаргуу", "Сонгодог силуэт"],
  Suede: ["Оригинал Converse", "Suede гадаргуу", "Street силуэт"],
  Retro: ["Оригинал Converse", "Retro гүйлтийн силуэт", "Gum тал улавчтай"],
  Platform: ["Оригинал Converse", "Өндөрсгөсөн platform тал улавч", "Bold силуэт"],
  Running: ["Оригинал New Balance", "N-ergy дэрлэг", "Y2K гүйлтийн силуэт"],
};
const SPECS: Record<string, Record<string, string>> = {
  Canvas: { "Брэнд": "Converse", "Гадна": "Даавуу", "Тал улавч": "Резин" },
  Suede: { "Брэнд": "Converse", "Гадна": "Suede", "Тал улавч": "Резин" },
  Retro: { "Брэнд": "Converse", "Төрөл": "Retro trainer", "Тал улавч": "Gum резин" },
  Platform: { "Брэнд": "Converse", "Гадна": "Даавуу", "Тал улавч": "Platform резин" },
  Running: { "Брэнд": "New Balance", "Загвар": "1906A", "Дэрлэг": "N-ergy" },
};

const e = (
  category: Category, shape: Shape, accent: string, fabric: string,
  rating: number, reviews: number, extra: Partial<Enrich> = {},
): Enrich => ({
  category, shape, gender: "Unisex", season: "All-Season", accent, fabric,
  colors: [accent], rating, reviews, badge: null,
  bullets: BULLETS[fabric], specs: SPECS[fabric], ...extra,
});

const CV = "Converse" as const;
const NBB = "New Balance" as const;

// UGG helper — winter footwear. Brand-correct bullets/specs are generated from
// the material label so we don't collide with the sneaker BULLETS/SPECS maps.
// Default gender Women / season Winter; override via `extra`.
const u = (
  shape: Shape, accent: string, fabric: string,
  rating: number, reviews: number, extra: Partial<Enrich> = {},
): Enrich => ({
  category: "UGG", shape, gender: "Women", season: "Winter", accent, fabric,
  colors: [accent], rating, reviews, badge: null,
  bullets: ["Оригинал UGG", `${fabric} гадаргуу`, "Хонины арьсан дулаалгатай"],
  specs: { "Брэнд": "UGG", "Гадна": fabric, "Дотор": "Хонины арьс/ноос" },
  ...extra,
});

// The North Face helper — down outerwear. Default gender Unisex / season Winter.
const t = (
  shape: Shape, accent: string, fabric: string,
  rating: number, reviews: number, extra: Partial<Enrich> = {},
): Enrich => ({
  category: "The North Face", shape, gender: "Unisex", season: "Winter", accent, fabric,
  colors: [accent], rating, reviews, badge: null,
  bullets: ["Оригинал The North Face", "700-fill хөвөн дүүргэгч", "Усны хальсан гадаргуу"],
  specs: { "Брэнд": "The North Face", "Дүүргэгч": "Down 700-fill", "Загвар": fabric },
  ...extra,
});

export const ENRICH: Record<string, Enrich> = {
  // Converse — Chuck 70 Hi
  "converse-chuck70-hi-black": e(CV, "hightop", "#111111", "Canvas", 5.0, 261),
  // Converse — Chuck Low
  "converse-chuck-low-blue-check": e(CV, "lowtop", "#2233AA", "Canvas", 4.6, 47, { badge: "New" }),
  // Converse — Platform
  "converse-chuck-low-black-stars": e(CV, "chunky", "#141414", "Platform", 4.7, 60),
  // Converse — One Star / Star Player (suede)
  "converse-star-player-burgundy": e(CV, "lowtop", "#6B2233", "Suede", 4.8, 65),
  // Converse — Suede low / futsal
  "converse-suede-low-black": e(CV, "lowtop", "#151515", "Suede", 4.7, 55),
  // Converse — Retro trainer
  "converse-retro-trainer-burgundy": e(CV, "runner", "#6B2233", "Retro", 4.7, 51),
  // New Balance 1906A (on sale: 359,000 → 250,000)

  // ── UGG — winter boots, platforms, puffers, sneakers & slippers ──
  "ugg-classic-knit-aztec": u("boot", "#8A5A3B", "Нэхмэл", 4.8, 61, { badge: "New" }),
  "ugg-platform-mini-sage": u("boot", "#8E8C6D", "Suede", 4.7, 48),
  "ugg-leather-heel-boot-black": u("boot", "#1A1A1A", "Арьс", 4.7, 39, { badge: "New" }),
  "ugg-platform-clog-chestnut": u("clog", "#B5712C", "Suede", 4.8, 112),
  "ugg-sneaker-boot-black": u("sneaker", "#171717", "Suede", 4.7, 54, { gender: "Unisex" }),
  "ugg-sweater-knit-tall-sand": u("boot", "#D8C3A5", "Нэхмэл", 4.8, 73),
  "ugg-sweater-knit-tall-black": u("boot", "#1C1C1C", "Нэхмэл", 4.8, 66),
  "ugg-sweater-knit-tall-chocolate": u("boot", "#5A3A2E", "Нэхмэл", 4.8, 58),
  "ugg-ultra-mini-chestnut": u("boot", "#B5712C", "Suede", 5.0, 342, { gender: "Unisex" }),
  "ugg-mini-fairisle-chestnut": u("boot", "#BE7A38", "Suede", 4.9, 97, { badge: "New" }),
  "ugg-tazz-chestnut": u("clog", "#B06A2E", "Suede", 4.9, 268),
  "ugg-puffer-mini-white": u("boot", "#EDE7DD", "Куртик", 4.7, 51),
  "ugg-puffer-mini-black": u("boot", "#141414", "Куртик", 4.7, 55),
  "ugg-puffer-mini-sand": u("boot", "#CBB393", "Куртик", 4.7, 47),
  "ugg-lowmel-sneaker-chestnut": u("sneaker", "#9C6B3F", "Suede", 4.8, 84, { gender: "Unisex", badge: "New" }),
  "ugg-lowmel-sneaker-pink": u("sneaker", "#C98BB0", "Suede", 4.7, 46),
  "ugg-lowmel-sneaker-sand": u("sneaker", "#CBB393", "Suede", 4.7, 52, { gender: "Unisex" }),
  "ugg-lowmel-sneaker-black": u("sneaker", "#1A1A1A", "Suede", 4.8, 61, { gender: "Unisex" }),
  "ugg-lowmel-sneaker-cow": u("sneaker", "#6B4A33", "Үслэг", 4.7, 38, { badge: "New" }),
  "ugg-lowmel-sneaker-black-leather": u("sneaker", "#141414", "Арьс", 4.7, 44, { gender: "Unisex" }),
  "ugg-leather-laceup-brown": u("boot", "#5A3D27", "Арьс", 4.8, 57, { gender: "Men" }),
  "ugg-weather-mini-chestnut": u("boot", "#B06A2E", "Suede", 4.8, 72, { gender: "Unisex" }),
  "ugg-classic-mini-chocolate": u("boot", "#5A4438", "Suede", 4.9, 131, { gender: "Unisex" }),
  "ugg-classic-mini-chestnut": u("boot", "#B5712C", "Suede", 5.0, 298, { gender: "Unisex" }),
  "ugg-classic-mini-black": u("boot", "#141414", "Suede", 4.9, 176, { gender: "Unisex" }),
  "ugg-tasman-fluff-chestnut": u("clog", "#B06A2E", "Suede", 4.8, 88),
  "ugg-tasman-fluff-taupe": u("clog", "#A99685", "Suede", 4.7, 64),
  "ugg-weather-mini-black": u("boot", "#161616", "Suede", 4.8, 69, { gender: "Unisex" }),
  "ugg-weather-hybrid-chestnut": u("boot", "#B06A2E", "Suede", 4.8, 60, { gender: "Unisex" }),
  "ugg-sweater-knit-tall-pink": u("boot", "#E3A9BE", "Нэхмэл", 4.8, 54, { badge: "New" }),
  "ugg-tasman-clog-pink": u("clog", "#E59BB5", "Suede", 4.7, 49),
  "ugg-ultra-mini-sand": u("boot", "#C3B18C", "Suede", 4.9, 121, { gender: "Unisex" }),
  "ugg-cozy-slipper-dark-brown": u("slipper", "#4A3528", "Suede", 4.8, 93, { gender: "Unisex" }),
  "ugg-cozy-slipper-taupe": u("slipper", "#9E8B78", "Suede", 4.8, 87, { gender: "Unisex" }),
  "ugg-hiker-tassel-olive": u("boot", "#6A6A47", "Suede", 4.7, 41, { badge: "New" }),
  "ugg-tasman-chestnut": u("clog", "#B06A2E", "Suede", 4.9, 214, { gender: "Unisex" }),
  "ugg-moc-laceup-chestnut": u("sneaker", "#A96B38", "Suede", 4.7, 50, { gender: "Unisex" }),

  // ── The North Face — 1996 Nuptse puffers, cropped & long down parkas ──
  "tnf-nuptse-blush-black": t("jacket", "#E9C9C5", "1996 Nuptse", 4.9, 142, { gender: "Women", badge: "New" }),
  "tnf-nuptse-olive-black": t("jacket", "#6B7445", "1996 Nuptse", 4.9, 118, { gender: "Men" }),
  "tnf-nuptse-ivory-black": t("jacket", "#EDE8DB", "1996 Nuptse", 4.9, 156),
  "tnf-nuptse-cream-camel": t("jacket", "#D9C7A0", "1996 Nuptse", 4.8, 97),
  "tnf-nuptse-cropped-charcoal": t("jacket", "#2B2B2E", "Cropped Nuptse", 4.8, 73, { gender: "Women", badge: "New" }),
  "tnf-nuptse-cropped-burgundy": t("jacket", "#5A2A33", "Cropped Nuptse", 4.8, 68, { gender: "Women" }),
  "tnf-nuptse-graphite-patch": t("jacket", "#4A4F55", "1996 Nuptse Patch", 4.9, 131),
  "tnf-nuptse-ice-blue-patch": t("jacket", "#BFD6E8", "1996 Nuptse Patch", 4.8, 84, { badge: "New" }),
  "tnf-nuptse-pale-sage-patch": t("jacket", "#C6CDB4", "1996 Nuptse Patch", 4.8, 79),
  "tnf-nuptse-dusty-rose": t("jacket", "#C98A86", "1996 Nuptse", 4.8, 90, { gender: "Women" }),
  "tnf-nuptse-purple-black": t("jacket", "#5B2A9E", "1996 Nuptse", 4.8, 88),
  "tnf-nuptse-navy-black": t("jacket", "#34425F", "1996 Nuptse", 4.9, 124, { gender: "Men" }),
  "tnf-nuptse-emerald-black": t("jacket", "#1E7A4D", "1996 Nuptse", 4.9, 101, { gender: "Men" }),
  "tnf-nuptse-charcoal-black": t("jacket", "#36393D", "1996 Nuptse", 4.9, 137),
  "tnf-nuptse-orange-black": t("jacket", "#F0531C", "1996 Nuptse", 4.9, 110, { gender: "Men", badge: "New" }),
  "tnf-long-parka-ivory": t("parka", "#ECE9E0", "Himalayan Parka", 4.8, 62, { gender: "Women" }),
  "tnf-long-parka-cream-camel": t("parka", "#D8C49B", "Himalayan Parka", 4.8, 58),
  "tnf-long-parka-navy": t("parka", "#2B3147", "Himalayan Parka", 4.9, 71, { gender: "Men" }),
  "tnf-long-parka-rose-brown": t("parka", "#B5745F", "Himalayan Parka", 4.8, 49, { gender: "Women" }),
  "tnf-nuptse-teal-petrol": t("jacket", "#1F8FB0", "1996 Nuptse", 4.8, 86),
  "tnf-nuptse-cropped-ivory": t("jacket", "#E7DFCD", "Cropped Nuptse", 4.8, 70, { gender: "Women", badge: "New" }),
};

export const DEFAULT_ENRICH: Enrich = {
  category: "Converse", shape: "lowtop", gender: "Unisex", season: "All-Season", accent: "#151515",
  fabric: "Canvas", colors: ["#151515"], rating: 4.7, reviews: 40, badge: null,
  bullets: BULLETS.Canvas, specs: SPECS.Canvas,
};
