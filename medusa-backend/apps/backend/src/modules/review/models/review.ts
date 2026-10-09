import { model } from "@medusajs/framework/utils";

/**
 * A customer's review of one product.
 *
 * Reviews land as `pending` and only reach the storefront once a moderator
 * approves them, so nothing a stranger types appears on the site unseen.
 * `customer_id` is kept so a shopper can be shown (and edit) their own review,
 * and so we can verify they actually bought the item.
 */
export const Review = model
  .define("review", {
    id: model.id({ prefix: "rev" }).primaryKey(),
    product_id: model.text(),
    customer_id: model.text().nullable(),
    // Display name, captured at write time: the review keeps reading correctly
    // even if the customer later changes their account name or is deleted.
    name: model.text(),
    rating: model.number(),
    title: model.text().nullable(),
    body: model.text(),
    // Set when the review is tied to an order containing the product.
    verified: model.boolean().default(false),
    status: model.enum(["pending", "approved", "rejected"]).default("pending"),
  })
  .indexes([
    { on: ["product_id", "status"] },
    { on: ["status", "created_at"] },
    // One review per customer per product; nulls (guests) are unconstrained.
    { on: ["product_id", "customer_id"], unique: true, where: "customer_id IS NOT NULL AND deleted_at IS NULL" },
  ]);
