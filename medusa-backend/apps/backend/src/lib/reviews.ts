import { Modules } from "@medusajs/framework/utils";
import { REVIEW_MODULE } from "../modules/review";

export type ReviewStatus = "pending" | "approved" | "rejected";

export type PublicReview = {
  id: string;
  product_id: string;
  name: string;
  rating: number;
  title: string | null;
  body: string;
  verified: boolean;
  created_at: string;
  product_handle?: string;
};

const MAX_BODY = 1200;
const MAX_TITLE = 90;
const MAX_NAME = 60;

export const reviewService = (scope: { resolve: (k: any) => any }) => scope.resolve(REVIEW_MODULE);

/** Trim to length and strip control characters / stray markup. */
export const clean = (v: unknown, max: number): string =>
  String(v ?? "")
    .replace(/[\u0000-\u001F\u007F]/g, " ")
    .replace(/<[^>]*>/g, "")
    .trim()
    .slice(0, max);

export function sanitizeInput(body: any) {
  const rating = Math.round(Number(body?.rating));
  return {
    product_id: clean(body?.product_id, 80),
    name: clean(body?.name, MAX_NAME),
    title: clean(body?.title, MAX_TITLE) || null,
    body: clean(body?.body, MAX_BODY),
    rating: Number.isFinite(rating) ? Math.min(5, Math.max(1, rating)) : NaN,
  };
}

export const toPublic = (r: any): PublicReview => ({
  id: r.id,
  product_id: r.product_id,
  name: r.name,
  rating: r.rating,
  title: r.title ?? null,
  body: r.body,
  verified: !!r.verified,
  created_at: r.created_at,
});

/** Mean rating + count over a set of reviews, rounded to one decimal. */
export function aggregate(reviews: { rating: number }[]) {
  if (!reviews.length) return { rating: null as number | null, count: 0 };
  const sum = reviews.reduce((a, r) => a + r.rating, 0);
  return { rating: Math.round((sum / reviews.length) * 10) / 10, count: reviews.length };
}

/**
 * The storefront identifies products by handle; orders and the product module
 * use the `prod_…` id. Reviews are stored against the id (so purchase
 * verification works and a handle rename doesn't orphan them), and this accepts
 * either form on the way in. Returns null when nothing matches.
 */
export async function resolveProductId(
  scope: { resolve: (k: any) => any },
  value: string,
): Promise<string | null> {
  if (!value) return null;
  const productModule: any = scope.resolve(Modules.PRODUCT);
  try {
    if (value.startsWith("prod_")) {
      const [p] = await productModule.listProducts({ id: [value] }, { take: 1, select: ["id"] });
      return p?.id ?? null;
    }
    const [p] = await productModule.listProducts({ handle: [value] }, { take: 1, select: ["id"] });
    return p?.id ?? null;
  } catch {
    return null;
  }
}

/** id → handle for a set of products, so public reviews can link to the item. */
export async function handlesFor(
  scope: { resolve: (k: any) => any },
  ids: string[],
): Promise<Record<string, string>> {
  const unique = [...new Set(ids)].filter(Boolean);
  if (!unique.length) return {};
  try {
    const productModule: any = scope.resolve(Modules.PRODUCT);
    const products = await productModule.listProducts({ id: unique }, { take: unique.length, select: ["id", "handle"] });
    return Object.fromEntries(products.map((p: any) => [p.id, p.handle]));
  } catch {
    return {};
  }
}
