import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { reviewService, clean } from "../../../../lib/reviews";
import { audit } from "../../../../lib/audit";

const STATUSES = ["pending", "approved", "rejected"];

// POST /admin/reviews/:id — approve or reject one review.
export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const started = Date.now();
  const id = req.params.id;
  const status = clean((req.body as any)?.status, 20);
  if (!STATUSES.includes(status)) {
    res.status(400).json({ message: `status must be one of ${STATUSES.join(", ")}` });
    return;
  }

  const [review] = await reviewService(req.scope).updateReviews([{ id, status }]);
  await audit(req.scope, {
    actor_id: (req as any).auth_context?.actor_id || null,
    action: "review.moderate",
    target: id,
    meta: { status },
  }, started);

  res.json({ review });
}

// DELETE /admin/reviews/:id — remove a review for good (spam, abuse).
export async function DELETE(req: MedusaRequest, res: MedusaResponse) {
  const started = Date.now();
  const id = req.params.id;
  await reviewService(req.scope).deleteReviews([id]);
  await audit(req.scope, {
    actor_id: (req as any).auth_context?.actor_id || null,
    action: "review.delete",
    target: id,
    meta: {},
  }, started);

  res.status(200).json({ id, deleted: true });
}
