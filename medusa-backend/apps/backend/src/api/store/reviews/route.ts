import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { Modules } from "@medusajs/framework/utils";
import { reviewService, sanitizeInput, toPublic, aggregate, clean, resolveProductId } from "../../../lib/reviews";

// GET /store/reviews?product_id=… — approved reviews for one product, newest
// first, with the aggregate the product page shows next to the title.
export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const ref = clean((req.query as any)?.product_id, 80);
  if (!ref) {
    res.status(400).json({ message: "product_id is required" });
    return;
  }
  // Accepts a handle (what the storefront uses) or a prod_… id.
  const productId = await resolveProductId(req.scope, ref);
  if (!productId) {
    res.json({ reviews: [], rating: null, count: 0 });
    return;
  }
  const reviews = await reviewService(req.scope).listReviews(
    { product_id: productId, status: "approved" },
    { order: { created_at: "DESC" }, take: 50 },
  );
  res.json({ reviews: reviews.map(toPublic), ...aggregate(reviews) });
}

/** Did this customer buy this product? Drives the "verified" badge. */
async function hasBought(scope: MedusaRequest["scope"], customerId: string, productId: string) {
  try {
    const orderModule: any = scope.resolve(Modules.ORDER);
    const orders = await orderModule.listOrders(
      { customer_id: customerId },
      { take: 50, relations: ["items"], select: ["id"] as any },
    );
    return orders.some((o: any) => (o.items || []).some((i: any) => i.product_id === productId));
  } catch {
    // Never block a review because the order lookup failed — just don't badge it.
    return false;
  }
}

// POST /store/reviews — leave a review. Signed-in customers only (one per
// product), held as `pending` until a moderator approves it.
export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const customerId = (req as any).auth_context?.actor_id;
  if (!customerId) {
    res.status(401).json({ message: "Сэтгэгдэл бичихийн тулд нэвтэрнэ үү" });
    return;
  }

  const input = sanitizeInput(req.body);
  const productId = await resolveProductId(req.scope, input.product_id);
  if (productId) input.product_id = productId;
  if (!productId || !input.body || !Number.isFinite(input.rating)) {
    res.status(400).json({ message: "product_id, rating (1-5) болон сэтгэгдлийн текст шаардлагатай" });
    return;
  }

  const service = reviewService(req.scope);
  const [existing] = await service.listReviews({ product_id: input.product_id, customer_id: customerId }, { take: 1 });
  if (existing) {
    res.status(409).json({ message: "Та энэ бараанд аль хэдийн сэтгэгдэл үлдээсэн байна" });
    return;
  }

  // Fall back to the account's own name when the form left it blank.
  let name = input.name;
  if (!name) {
    try {
      const customerModule: any = req.scope.resolve(Modules.CUSTOMER);
      const c = await customerModule.retrieveCustomer(customerId, { select: ["first_name", "last_name", "email"] as any });
      name = clean([c?.first_name, c?.last_name].filter(Boolean).join(" ") || c?.email?.split("@")[0], 60);
    } catch { /* keep it anonymous rather than fail the write */ }
  }

  const review = await service.createReviews({
    ...input,
    name: name || "Хэрэглэгч",
    customer_id: customerId,
    verified: await hasBought(req.scope, customerId, input.product_id),
    status: "pending",
  });

  res.status(201).json({ review: toPublic(review), status: "pending" });
}
