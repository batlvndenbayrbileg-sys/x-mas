import { ExecArgs } from "@medusajs/framework/types";
import { Modules } from "@medusajs/framework/utils";
import { createProductCategoriesWorkflow } from "@medusajs/medusa/core-flows";

// Canonical X-MAS brand taxonomy — lives in Medusa so it scales to a 10k+ catalog.
// handle = storefront category key (lowercased slug); name = brand display.
export const CATEGORIES = [
  { handle: "converse", name: "Converse" },
  { handle: "new-balance", name: "New Balance" },
  { handle: "ugg", name: "UGG" },
  { handle: "the-north-face", name: "The North Face" },
];

// Brand name → handle, so seeders/importers can map their brand column.
export const MN_TO_HANDLE: Record<string, string> = Object.fromEntries(
  CATEGORIES.map(c => [c.name, c.handle])
);

export default async function seedCategories({ container }: ExecArgs) {
  const logger = container.resolve("logger");
  const productModule = container.resolve(Modules.PRODUCT);

  // Fetch ALL categories and compare in JS — the `{ handle: [...] }` list filter
  // has proven unreliable across Medusa versions (returns empty, so existing
  // brands get re-created and the whole batch aborts with a duplicate error).
  const existing = await productModule.listProductCategories({}, { take: 1000 } as any);
  const have = new Set(existing.map(c => c.handle));

  // Create missing categories one-by-one so one duplicate never aborts the rest.
  let created = 0;
  for (const c of CATEGORIES) {
    if (have.has(c.handle)) continue;
    try {
      await createProductCategoriesWorkflow(container).run({
        input: { product_categories: [{ name: c.name, handle: c.handle, is_active: true, is_internal: false }] },
      });
      created++;
    } catch (e) {
      logger.warn(`Skipped category ${c.handle}: ${(e as Error).message}`);
    }
  }
  logger.info(created ? `Created ${created} product categories.` : "Product categories already present.");
  const all = await productModule.listProductCategories({ handle: CATEGORIES.map(c => c.handle) });
  logger.info(`Categories ready: ${all.map(c => `${c.name} (${c.handle})`).join(", ")}`);
}
