import type { Product, Shape } from "./types";

/**
 * Product-type axis, cutting across brands: a UGG boot and a Converse sneaker
 * sit in different rows even though both are footwear. Brand stays its own
 * filter (`?category=`), so the two narrow independently.
 */
export type ProductType = "sneakers" | "boots" | "jackets";

export const TYPES: { key: ProductType; shapes: Shape[] }[] = [
  { key: "sneakers", shapes: ["sneaker", "lowtop", "hightop", "runner", "chunky", "skate"] },
  // Slippers and clogs are bought from the same shelf as boots, and there are
  // too few of them to carry a row of their own.
  { key: "boots", shapes: ["boot", "clog", "slipper", "slide"] },
  { key: "jackets", shapes: ["jacket", "parka"] },
];

const OF_SHAPE = new Map<Shape, ProductType>(
  TYPES.flatMap(t => t.shapes.map(s => [s, t.key] as const))
);

export const typeOf = (p: Product): ProductType | undefined => OF_SHAPE.get(p.shape);

export const isType = (v: string | undefined): v is ProductType =>
  !!v && TYPES.some(t => t.key === v);
