import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { reviewService, clean } from "../../../lib/reviews";

const STATUSES = ["pending", "approved", "rejected"] as const;

// GET /admin/reviews?status=pending — moderation queue. `status=all` lists
// everything; anything else narrows to that one state.
export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const status = clean((req.query as any)?.status, 20) || "pending";
  const filters = status === "all" ? {} : { status };

  const service = reviewService(req.scope);
  const reviews = await service.listReviews(filters, { order: { created_at: "DESC" }, take: 200 });

  // Small counts for the tabs, so a moderator sees the backlog at a glance.
  const all = await service.listReviews({}, { take: 1000, select: ["status"] as any });
  const counts = Object.fromEntries(STATUSES.map(s => [s, all.filter((r: any) => r.status === s).length]));

  res.json({ reviews, counts, total: all.length });
}
