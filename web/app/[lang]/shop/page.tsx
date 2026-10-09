import { LocaleLink as Link } from "@/components/LocaleLink";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { ProductCard } from "@/components/ProductCard";
import { ArrowRight, SearchIcon } from "@/components/Icons";
import { api } from "@/lib/api";
import { tFor, type Lang } from "@/lib/i18n";
import type { Product } from "@/lib/types";
import { TYPES, typeOf, isType, type ProductType } from "@/lib/taxonomy";
import { SortSelect, ShopFilters } from "./_ShopControls";
import { Reveal } from "@/app/[lang]/_components/Reveal";
import type { Metadata } from "next";

// Reads searchParams (filters) → dynamic; product data is still fetch-cached.
export const dynamic = "force-dynamic";

const SITE = (process.env.NEXT_PUBLIC_SITE_URL || "https://xmas.mn").replace(/\/$/, "");

export function generateMetadata(
  { params, searchParams }: { params: { lang: Lang }; searchParams: { type?: string } },
): Metadata {
  const t = tFor(params.lang);
  const type = isType(searchParams.type) ? searchParams.type : undefined;
  const title = `${type ? t(`type.${type}`) : t("shop.titleAll")} — X-MAS`;
  const description = params.lang === "mn"
    ? "X-MAS дэлгүүрийн бүх бараа — Converse, UGG, The North Face. Пүүз, гутал, куртик. 100% оригинал, QPay-ээр төлнө."
    : "Browse all X-MAS products — Converse, UGG & The North Face. Sneakers, boots & down jackets. 100% authentic, pay with QPay.";
  const url = `${SITE}/${params.lang}/shop`;
  return {
    title,
    description,
    alternates: { canonical: url, languages: { mn: `${SITE}/mn/shop`, en: `${SITE}/en/shop` } },
    openGraph: { title, description, url, type: "website", siteName: "X-MAS" },
  };
}

const cats = ["all", "Converse", "UGG", "The North Face"];

export default async function ShopPage({
  params,
  searchParams,
}: { params: { lang: Lang }; searchParams: { category?: string; sort?: string; q?: string; gender?: string; filter?: string; color?: string; tech?: string; minPrice?: string; maxPrice?: string; type?: string } }) {
  const t = tFor(params.lang);
  // Resilient: a catalog outage degrades to the empty state, never a 500.
  const [listRes, allForColors] = await Promise.all([
    api.products.list({
      category: searchParams.category,
      sort: searchParams.sort,
      q: searchParams.q,
      gender: searchParams.gender,
      filter: searchParams.filter,
      color: searchParams.color,
      tech: searchParams.tech,
      minPrice: searchParams.minPrice,
      maxPrice: searchParams.maxPrice,
    }).catch(() => ({ data: [] as Product[], total: 0 })),
    api.products.list({}).catch(() => ({ data: [] as Product[] })),
  ]);
  const { data: all, total: allTotal } = listRes;

  // The type axis is applied here rather than in the API layer: it is derived
  // from each product's shape, which both backends already return.
  const activeType = isType(searchParams.type) ? searchParams.type : undefined;
  const products = activeType ? all.filter(p => typeOf(p) === activeType) : all;
  const total = activeType ? products.length : allTotal;

  // With nothing narrowed down, the page browses by type — two rows per section
  // and a link through to the full list — instead of one undifferentiated grid.
  const browsing = !activeType && !Object.entries(searchParams)
    .some(([k, v]) => k !== "sort" && v);
  const sections = browsing
    ? TYPES.map(({ key }) => ({ key, items: products.filter(p => typeOf(p) === key) }))
        .filter(s => s.items.length > 0)
    : [];
  // Real swatches: unique product accents, so every colour chip yields results.
  const availableColors = Array.from(new Set(allForColors.data.map(p => p.accent)));

  return (
    <>
      <div className="px-3 pt-3 sm:px-4 sm:pt-4 lg:px-5 lg:pt-5 pb-2 mesh-light min-h-screen">
        <div className="max-w-[1280px] mx-auto">
          <Nav />

          {/* Title */}
          <header className="mt-6 sm:mt-8">
            <Reveal>
              <div className="text-[11px] font-mono tracking-wider text-subtle flex items-center gap-2">
                <Link href="/" className="hover:text-ink uppercase">{t("bc.home")}</Link><span className="opacity-40">/</span>
                <span className="text-ink uppercase">{t("bc.shop")}</span><span className="opacity-40 mx-1">·</span><span>{total} {t("shop.items")}</span>
              </div>
              <h1 className="font-display text-[34px] sm:text-[52px] tracking-tight leading-[.95] uppercase mt-3">
                {t("shop.titlePre")}{" "}
                <span className="text-accent">
                  {activeType ? t(`type.${activeType}`) : t("shop.titleAll")}
                </span>
              </h1>
            </Reveal>
          </header>

          {/* Sticky toolbar: categories + sort */}
          <div className="sticky top-2 z-20 mt-5 -mx-3 px-3 sm:mx-0 sm:px-0">
            <div className="flex items-center gap-2 bg-white/80 backdrop-blur border border-line rounded-pill p-1.5 shadow-soft">
              <div className="flex gap-1.5 overflow-x-auto no-scrollbar flex-1">
                {cats.map(c => {
                  const active = (!searchParams.category && c === "all") || searchParams.category === c;
                  return (
                    <Link key={c} href={c === "all" ? "/shop" : `/shop?category=${encodeURIComponent(c)}`}
                      className={`h-9 px-4 rounded-pill text-[13px] font-medium inline-flex items-center whitespace-nowrap shrink-0 transition ${
                        active ? "bg-ink text-white" : "text-muted hover:text-ink"
                      }`}>
                      {t(`cat.${c}`)}
                    </Link>
                  );
                })}
              </div>
              <div className="shrink-0">
                <SortSelect/>
              </div>
            </div>
          </div>

          {/* Active type, shown as a chip the shopper can drop */}
          {activeType && (
            <div className="mt-4 flex items-center gap-2">
              <span className="inline-flex h-9 items-center gap-2 rounded-pill bg-ink pl-4 pr-1.5 text-[13px] font-medium text-white">
                {t(`type.${activeType}`)}
                <Link href="/shop" aria-label={t("shop.reset")}
                  className="grid h-6 w-6 place-items-center rounded-full bg-white/15 text-[15px] leading-none transition-colors hover:bg-white/30">×</Link>
              </span>
            </div>
          )}

          {/* Collapsible filters */}
          <ShopFilters colors={availableColors}/>

          {/* Grid */}
          {products.length === 0 ? (
            <Reveal className="mt-10 bg-white border border-line rounded-2xl p-12 text-center">
              <span className="mx-auto mb-5 grid h-16 w-16 place-items-center rounded-full bg-surface-2 text-ink/40">
                <SearchIcon width={26} height={26}/>
              </span>
              <h3 className="font-display text-[22px]">{t("shop.emptyTitle")}</h3>
              <p className="text-muted mt-2 text-sm max-w-[320px] mx-auto">{t("shop.emptyDesc")}</p>
              <Link href="/shop" className="btn btn-primary mt-6 inline-flex">{t("shop.reset")} <ArrowRight width={14} height={14}/></Link>
            </Reveal>
          ) : (
            <>
              {sections.length > 0 ? (
                sections.map(({ key, items }) => (
                  <TypeSection key={key} type={key} items={items} lang={params.lang} />
                ))
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 mt-6">
                  {products.map((p, i) => <ProductCard key={p.id} product={p} index={i}/>)}
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <Footer />
    </>
  );
}

/** Two rows of one product type, with a way through to the rest of it. */
function TypeSection({ type, items, lang }: { type: ProductType; items: Product[]; lang: Lang }) {
  const t = tFor(lang);
  // Two rows at the widest grid; narrower screens simply show more rows.
  const PREVIEW = 8;
  const shown = items.slice(0, PREVIEW);
  const href = `/shop?type=${type}`;

  return (
    <section className="mt-10 first:mt-6">
      <Reveal className="flex items-end justify-between gap-4">
        <div className="min-w-0">
          <h2 className="font-display text-[22px] uppercase leading-none tracking-tight sm:text-[30px]">
            {t(`type.${type}`)}
          </h2>
          <p className="mt-1.5 text-[12.5px] text-muted">{items.length} {t("shop.items")}</p>
        </div>
        <Link href={href} className="chip shrink-0">
          {t("common.viewDetails")} <ArrowRight width={13} height={13} />
        </Link>
      </Reveal>

      <div className="mt-5 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
        {shown.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
      </div>
    </section>
  );
}
