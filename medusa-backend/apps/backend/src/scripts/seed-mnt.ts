import { ExecArgs } from "@medusajs/framework/types";
import { Modules } from "@medusajs/framework/utils";
import {
  createRegionsWorkflow,
  updateProductVariantsWorkflow,
  createServiceZonesWorkflow,
  createShippingOptionsWorkflow,
} from "@medusajs/medusa/core-flows";

// 1 USD ≈ 3450 MNT (adjust to taste). Prices kept as integers (MNT has no cents).
const RATE = 3450;

const USD: Record<string, number> = {
  "tech-fleece-hoodie": 128, "performance-tank": 42, "training-joggers": 96,
  "compression-longsleeve": 64, "windbreaker-jacket": 148, "lined-training-shorts": 56,
  "seamless-leggings": 88, "womens-cropped-tee": 44, "tactical-sling-bag": 72,
  "performance-cap": 34, "thermal-hooded-base": 78, "cargo-tech-pants": 116,
};

export default async function seedMnt({ container }: ExecArgs) {
  const logger = container.resolve("logger");
  const storeModule = container.resolve(Modules.STORE);
  const regionModule = container.resolve(Modules.REGION);
  const productModule = container.resolve(Modules.PRODUCT);
  const fulfillmentModule = container.resolve(Modules.FULFILLMENT);

  // 1) Add MNT to store currencies (default)
  const [store] = await storeModule.listStores();
  await storeModule.updateStores(store.id, {
    supported_currencies: [
      { currency_code: "mnt", is_default: true },
      { currency_code: "usd" },
    ],
  });
  logger.info("Store currencies: mnt (default), usd");

  // 2) Mongolia (MNT) region
  let [mnRegion] = await regionModule.listRegions({ currency_code: "mnt" });
  if (!mnRegion) {
    const { result } = await createRegionsWorkflow(container).run({
      input: { regions: [{ name: "Mongolia", currency_code: "mnt", countries: ["mn"], payment_providers: ["pp_system_default"] }] },
    });
    mnRegion = result[0];
    logger.info(`Created Mongolia region: ${mnRegion.id}`);
  } else {
    logger.info(`Mongolia region exists: ${mnRegion.id}`);
  }

  // 3) Add MNT price to every variant (keep USD too)
  const products = await productModule.listProducts({}, { relations: ["variants"], take: 1000 });
  const updates: { id: string; prices: { currency_code: string; amount: number }[] }[] = [];
  for (const p of products) {
    const usd = USD[p.handle as string];
    if (!usd) continue;
    for (const v of p.variants) {
      updates.push({ id: v.id, prices: [
        { currency_code: "usd", amount: usd },
        { currency_code: "mnt", amount: usd * RATE },
      ] });
    }
  }
  if (updates.length) {
    await updateProductVariantsWorkflow(container).run({ input: { product_variants: updates } });
    logger.info(`Added MNT prices to ${updates.length} variants`);
  }

  // 4) Mongolia shipping — this script is the single authority for what the
  // storefront offers, because three different seeds used to create options and
  // checkout ended up listing four. Two problems it now cleans up:
  //   * a second service zone ("Mongolia") alongside the canonical "Монгол",
  //     both matching country mn, so every option appeared twice;
  //   * an "Express (MN)" priced at 18 USD × 3450 = ₮62,100 — a mechanical
  //     currency conversion, not a delivery price anyone would charge.
  const CANON_ZONE = "Монгол";
  const LEGACY_ZONES = ["Mongolia"];
  const OPTIONS = [
    { name: "Standard Shipping", amount: 5000, code: "standard", label: "Standard", description: "3-5 business days" },
    { name: "Express Shipping", amount: 9900, code: "express", label: "Express", description: "1-2 business days" },
  ];

  const [profile] = await fulfillmentModule.listShippingProfiles({});
  const sets = await fulfillmentModule.listFulfillmentSets({}, { relations: ["service_zones"] });
  const fset = sets[0];

  let [zone] = await fulfillmentModule.listServiceZones({ name: CANON_ZONE });
  if (!zone) {
    const { result } = await createServiceZonesWorkflow(container).run({
      input: { data: [{ fulfillment_set_id: fset.id, name: CANON_ZONE, geo_zones: [{ type: "country", country_code: "mn" }] }] },
    });
    zone = result[0];
    logger.info(`Created ${CANON_ZONE} service zone`);
  }

  // Drop any duplicate mn zone and everything hanging off it.
  for (const name of LEGACY_ZONES) {
    const [dupe] = await fulfillmentModule.listServiceZones({ name });
    if (!dupe) continue;
    const opts = await fulfillmentModule.listShippingOptions({ service_zone: { id: dupe.id } } as any);
    if (opts.length) {
      await fulfillmentModule.deleteShippingOptions(opts.map(o => o.id));
      logger.info(`Removed ${opts.length} shipping options from the duplicate "${name}" zone`);
    }
    await fulfillmentModule.deleteServiceZones([dupe.id]);
    logger.info(`Removed duplicate service zone "${name}"`);
  }

  // Exactly one of each canonical option, at the price the storefront quotes.
  for (const opt of OPTIONS) {
    const found = await fulfillmentModule.listShippingOptions({ name: opt.name });
    if (found.length > 1) {
      await fulfillmentModule.deleteShippingOptions(found.slice(1).map(o => o.id));
      logger.info(`Removed ${found.length - 1} duplicate "${opt.name}" option(s)`);
    }
    if (found.length) continue;
    await createShippingOptionsWorkflow(container).run({
      input: [{
        name: opt.name, service_zone_id: zone.id, shipping_profile_id: profile.id, provider_id: "manual_manual",
        type: { label: opt.label, description: opt.description, code: opt.code }, price_type: "flat",
        prices: [{ currency_code: "mnt", amount: opt.amount }],
        rules: [{ attribute: "enabled_in_store", value: "true", operator: "eq" }, { attribute: "is_return", value: "false", operator: "eq" }],
      }],
    });
    logger.info(`Created "${opt.name}" (₮${opt.amount})`);
  }

  logger.info("MNT seed complete.");
}
