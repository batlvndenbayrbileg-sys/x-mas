import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { reviewService, toPublic, handlesFor } from "../../../../lib/reviews";

// GET /store/reviews/latest?limit=12 — the newest approved reviews across the
// whole catalogue. Feeds the homepage wall, which renders nothing when this is
// empty, so the site never shows invented testimonials.
export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const raw = Number((req.query as any)?.limit);
  const take = Number.isFinite(raw) ? Math.min(40, Math.max(1, Math.round(raw))) : 12;

  const reviews = await reviewService(req.scope).listReviews(
    { status: "approved" },
    { order: { created_at: "DESC" }, take },
  );
  // Carry each product's handle so the storefront can link the card.
  const handles = await handlesFor(req.scope, reviews.map((r: any) => r.product_id));
  res.json({
    reviews: reviews.map((r: any) => ({ ...toPublic(r), product_handle: handles[r.product_id] })),
  });
}
