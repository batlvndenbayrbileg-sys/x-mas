import { LocaleLink as Link } from "@/components/LocaleLink";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { ProductCard } from "@/components/ProductCard";
import type { Product } from "@/lib/types";
import { Photo } from "@/components/Photo";
import { ArrowUpRight, ArrowRight } from "@/components/Icons";
import { api, money } from "@/lib/api";
import { Reveal } from "./_components/Reveal";
import { HeroKick } from "./_components/HeroKick";
import { Countdown } from "./_components/Countdown";
import { BrandMarquee } from "./_components/BrandMarquee";
import { TrendingSection } from "./_components/TrendingSection";
import { Testimonials3D } from "./_components/Testimonials3D";
import { Parallax } from "./_components/Parallax";
import { ScrollProgress } from "./_components/ScrollProgress";
import { CoverflowCarousel } from "@/components/ui/coverflow-carousel";
import ViewfinderFlipCarousel from "@/components/ui/viewfinder-flip-carousel";
import { tFor, type Lang } from "@/lib/i18n";

export const revalidate = 300;

export default async function HomePage({ params }: { params: { lang: Lang } }) {
  const t = tFor(params.lang);
  const res = await api.products.list({}).catch(() => ({ data: [] as Product[] }));
  const all = res.data;

  // Trending shows transparent cutouts only: the legacy Converse promo-card JPGs
  // have the logo and price burned into the artwork, which double-prints next to
  // the card's own price. Cutouts keep the grid clean (and cover every brand).
  const cutouts = all.filter(p => (p.image ?? "").endsWith(".png"));
  const trendFeatured = cutouts.find(p => p.slug === "converse-suede-low-black") || cutouts[0] || all[0];
  // Pool of 15 → three pages of (1 featured + 4) behind the ‹ › pager.
  const trendPool = [trendFeatured, ...cutouts.filter(p => p.id !== trendFeatured?.id)]
    .filter(Boolean).slice(0, 15) as Product[];
  // Spotlight flip-carousel: a brand-balanced set of cutouts.
  const spotlight = [
    ...cutouts.filter(p => p.category === "Converse").slice(0, 4),
    ...cutouts.filter(p => p.category === "UGG").slice(0, 3),
    ...cutouts.filter(p => p.category === "The North Face").slice(0, 3),
  ];
  const vibe = all.slice(6, 14);
  const newArrivals = [all.find(p => p.slug === "converse-chuck-low-black-stars"), ...all.filter(p => p.badge === "New"), ...all].filter(Boolean).filter((p, i, a) => a.findIndex(x => x!.id === p!.id) === i).slice(0, 5) as Product[];
  const hiTops = all.filter(p => p.shape === "hightop").slice(0, 4);
  const lowTops = all.filter(p => p.shape === "lowtop").slice(0, 4);
  const nb = all.filter(p => p.category === "New Balance");
  const limited = nb[0] || all[0];
  // Hero rotator — one clean cutout per brand so the hero shows the full range
  // (sneaker · boot · jacket), not just sneakers.
  const heroSet = [
    all.find(p => p.slug === "converse-chuck70-hi-black"),
    all.find(p => p.slug === "ugg-ultra-mini-chestnut"),
    all.find(p => p.slug === "tnf-nuptse-orange-black"),
    all.find(p => p.slug === "converse-chuck-low-blue-check"),
  ].filter(Boolean) as Product[];

  // Shop-by-brand showcase — one iconic cutout per brand (incl. UGG & North Face).
  const pick = (cat: string, ...slugs: string[]): Product | undefined =>
    (slugs.map(s => all.find(p => p.slug === s)).find(Boolean)) || all.find(p => p.category === cat);
  const brands = [
    { name: "Converse", labelKey: "cat.Converse", href: "/shop?category=Converse", p: pick("Converse", "converse-chuck70-hi-black") },
    { name: "New Balance", labelKey: "cat.New Balance", href: "/shop?category=New%20Balance", p: pick("New Balance", "nb-1906a-silver") },
    { name: "UGG", labelKey: "cat.UGG", href: "/shop?category=UGG", p: pick("UGG", "ugg-ultra-mini-chestnut", "ugg-classic-mini-chestnut") },
    { name: "The North Face", labelKey: "cat.The North Face", href: "/shop?category=The%20North%20Face", p: pick("The North Face", "tnf-nuptse-orange-black", "tnf-nuptse-charcoal-black") },
  ].filter(b => b.p) as { name: string; labelKey: string; href: string; p: Product }[];

  const SITE = (process.env.NEXT_PUBLIC_SITE_URL || "https://xmas.mn").replace(/\/$/, "");
  const structuredData = [
    { "@context": "https://schema.org", "@type": "Organization", name: "X-MAS", url: SITE, logo: `${SITE}/icon.svg` },
  ];

  const wrap = "mx-auto max-w-[1280px] px-4 sm:px-6";

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }} />
      <ScrollProgress />

      <div className="mesh-light min-h-screen">
        <Nav />

        {/* ===== HERO ===== */}
        <section className={`${wrap} mt-5`}>
          <HeroKick products={heroSet.length ? heroSet : all} />
        </section>

        {/* ===== TRUSTED BY ===== */}
        <section className={`${wrap} mt-12 sm:mt-16`}>
          <h2 className="text-center font-display text-[18px] sm:text-[22px] uppercase tracking-[.06em] text-ink">{t("home.trusted")}</h2>
          <div className="mt-4"><BrandMarquee /></div>
        </section>

        {/* ===== SHOP BY BRAND ===== */}
        {brands.length > 0 && (
        <section className={`${wrap} mt-14 sm:mt-20`}>
          <Reveal>
            <div className="text-[11px] uppercase tracking-[.22em] font-semibold text-accent">{t("home.brands")}</div>
            <h2 className="hd-2 mt-1">{t("home.brandsSub")}</h2>
          </Reveal>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
            {brands.map((b, i) => <BrandCard key={b.name} brand={b} t={t} delay={i * 0.06} />)}
          </div>
        </section>
        )}

        {/* ===== TRENDING ===== */}
        <section className={`${wrap} mt-14 sm:mt-20`}>
          <Reveal blur>
            <TrendingSection products={trendPool} title={t("home.trending")} seeAll={t("common.seeAll")} />
          </Reveal>
        </section>

        {/* ===== PRODUCT FEATURES ===== */}
        <section className={`${wrap} mt-16 sm:mt-24`}>
          <Reveal>
            <h2 className="hd-2">{t("home.features")}</h2>
            <p className="text-muted mt-1">{t("home.featuresSub")}</p>
          </Reveal>
          <Reveal blur className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
            {/* artwork is paired to the claim: bold colourway, then rubber outsole */}
            <FeatureCard tint="from-[#24262b] to-[#0b0c0d]" img={pick("The North Face", "tnf-nuptse-orange-black")?.image} title={t("home.feat1")} desc={t("home.feat1d")} />
            <FeatureCard tint="from-[#1d3a2f] to-[#0a1510]" img={all.find(p=>p.slug==="converse-chuck70-hi-black")?.image} title={t("home.feat3")} desc={t("home.feat3d")} />
          </Reveal>
          <Reveal blur delay={0.08} className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
            <FeatureCard tint="from-[#17222e] to-[#090d12]" img={pick("UGG", "ugg-classic-mini-chestnut")?.image} title={t("home.feat2")} desc={t("home.feat2d")} small />
            <FeatureCard tint="from-[#2a1a22] to-[#120a0e]" img={pick("UGG", "ugg-tasman-chestnut")?.image} title={t("home.feat4")} desc={t("home.feat4d")} small />
            <FeatureCard tint="from-[#2a2017] to-[#120d08]" img={all.find(p=>p.slug==="converse-chuck-low-blue-check")?.image} title={t("home.feat5")} desc={t("home.feat5d")} small />
          </Reveal>
        </section>

        {/* ===== SPOTLIGHT (viewfinder flip) ===== */}
        {spotlight.length > 2 && (
        <section className={`${wrap} mt-16 sm:mt-24`}>
          <Reveal>
            <h2 className="hd-2">{t("home.spotlight")}</h2>
            <p className="text-muted mt-1">{t("home.spotlightSub")}</p>
          </Reveal>
          <Reveal blur className="mt-6 rounded-[2rem] border border-line bg-white overflow-hidden">
            <ViewfinderFlipCarousel
              items={spotlight.map(p => ({ title: p.name, src: p.image, alt: p.name }))}
              height="520px"
              size={230}
              openWidth={330}
              foldedWidth={62}
              radius={16}
              titles
              background="transparent"
              color="#161515"
              fontFamily="inherit"
              defaultIndex={Math.min(3, spotlight.length - 1)}
              ariaLabel={t("home.spotlight")}
            />
          </Reveal>
        </section>
        )}

        {/* ===== CHOOSE YOUR VIBE (coverflow) ===== */}
        <section className="mt-16 sm:mt-24">
          <div className={wrap}><h2 className="hd-2 text-center">{t("home.vibe")}</h2></div>
          <div className="mt-2">
            <CoverflowCarousel
              slides={vibe.map(p => ({ src: p.image ?? "", alt: p.name, title: p.name, subtitle: money(p.price) }))}
              showCaption
              showNavigation
              showPagination
              cardWidth="clamp(180px, 26vw, 300px)"
              label={t("home.vibe")}
            />
          </div>
        </section>

        {/* ===== COLLECTION / NEW ARRIVALS ===== */}
        <section className={`${wrap} mt-14 sm:mt-20`}>
          <div className="text-[11px] uppercase tracking-[.22em] font-semibold text-accent">{t("home.collection")}</div>
          <SectionHead title={t("home.newArrivals")} href="/shop?filter=new" cta={t("home.exploreMore")} />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5 mt-6">
            {newArrivals[0] && <Reveal blur><FeaturedCard product={newArrivals[0]} t={t} drop /></Reveal>}
            <div className="grid grid-cols-2 gap-4 sm:gap-5">
              {newArrivals.slice(1, 5).map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
            </div>
          </div>
        </section>

        {/* ===== FRESH FITS ===== */}
        <FreshRow wrap={wrap} title={t("home.freshHi")} cta={t("home.exploreMore")} items={hiTops} />
        <FreshRow wrap={wrap} title={t("home.freshLow")} cta={t("home.exploreMore")} items={lowTops} />

        {/* ===== COMMUNITY (3D testimonials) ===== */}
        <section className="mt-16 sm:mt-24">
          <div className={wrap}><h2 className="hd-2 text-center">{t("home.community")}</h2></div>
          <div className="mt-4"><Testimonials3D /></div>
        </section>

        {/* ===== LIMITED DROP ===== */}
        {limited && (
        <section className={`${wrap} mt-16 sm:mt-24`}>
          <Reveal blur>
          <div className="relative overflow-hidden rounded-[2rem] card-dark text-white p-6 sm:p-10 lg:p-12">
            <div className="absolute -left-24 -bottom-24 w-80 h-80 rounded-full bg-accent/25 blur-3xl" />
            <div className="absolute right-8 top-8 hidden sm:block font-display text-[13px] uppercase tracking-[.3em] text-white/25">X · MAS</div>
            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-[1.1fr_1fr] gap-8 lg:gap-10 items-center">
              <div>
                <span className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[.24em] font-semibold text-accent">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />{t("home.limitedKicker")}
                </span>
                <h2 className="hd-1 mt-3">{limited.name}</h2>
                <p className="text-white/65 mt-3 max-w-[400px]">{t("home.limitedDesc")}</p>
                <div className="mt-7"><Countdown /></div>
                <Link href={`/product/${limited.slug}`} className="btn btn-primary mt-8">
                  {t("home.grabNow")} <span className="arrow-cap bg-white/25 text-white"><ArrowUpRight width={14} height={14}/></span>
                </Link>
              </div>
              <div className="relative rounded-[1.5rem] bg-white/[.05] border border-white/10 overflow-hidden aspect-[4/3]">
                <Parallax amount={24} className="absolute inset-0">
                  <Photo src={limited.image} alt={limited.name} imgClassName="object-contain p-3" />
                </Parallax>
              </div>
            </div>
          </div>
          </Reveal>
        </section>
        )}

      </div>

      <Footer />
    </>
  );
}

/* ---------- helpers ---------- */

function SectionHead({ title, href, cta }: { title: string; href: string; cta: string }) {
  return (
    <Reveal className="flex items-end justify-between gap-4">
      <h2 className="hd-2">{title}</h2>
      <Link href={href} className="chip shrink-0">{cta} <ArrowRight width={13} height={13}/></Link>
    </Reveal>
  );
}

function FeaturedCard({ product, t, drop }: { product: Product; t: (k:string)=>string; drop?: boolean }) {
  return (
    <Link href={`/product/${product.slug}`} className="group relative flex flex-col justify-between overflow-hidden rounded-[1.6rem] bg-white border border-line p-6 min-h-[360px] transition-shadow hover:shadow-deep">
      <div className="relative z-10">
        {product.badge && <span className={`text-[10px] uppercase tracking-[.14em] font-semibold px-2.5 h-6 rounded-pill inline-grid place-items-center ${product.badge==="New"?"bg-accent text-white":"bg-ink text-white"}`}>{product.badge}</span>}
        <h3 className="font-display text-[26px] sm:text-[30px] uppercase leading-none mt-3 group-hover:text-accent-deep transition-colors">{product.name}</h3>
        <div className="font-display text-[20px] text-accent-deep mt-1 num-tabular">{money(product.price)}</div>
        {drop && <div className="mt-4"><span className="font-display text-[22px] text-accent uppercase leading-none">{t("home.justDropped")}</span></div>}
      </div>
      <div className="pointer-events-none absolute right-0 bottom-0 w-[78%] h-[72%]">
        <Parallax amount={26} className="relative w-full h-full">
          <Photo src={product.image} alt={product.name} imgClassName="object-contain object-right-bottom drop-shadow-[0_24px_30px_rgba(22,21,21,.25)] transition-transform duration-500 group-hover:scale-105" />
        </Parallax>
      </div>
      <span className="relative z-10 self-start mt-4 w-11 h-11 rounded-full bg-accent text-white grid place-items-center group-hover:bg-accent-deep transition-colors shadow-[0_10px_24px_-8px_rgba(241,89,43,.7)]">
        <ArrowUpRight width={16} height={16} />
      </span>
    </Link>
  );
}

function FeatureCard({ img, title, desc, small, tint = "from-[#1b1c1f] to-[#0a0b0c]" }: {
  img?: string; title: string; desc: string; small?: boolean; tint?: string;
}) {
  const isCutout = (img ?? "").endsWith(".png");
  return (
    <div className={`group relative overflow-hidden rounded-[1.4rem] border border-white/5 bg-gradient-to-br ${tint} ${small ? "min-h-[230px]" : "min-h-[280px]"}`}>
      {/* soft accent glow top-right */}
      <div className="absolute -top-12 -right-12 w-44 h-44 rounded-full bg-accent/25 blur-3xl" />
      {img && (
        <div className={`absolute ${isCutout ? "inset-x-4 top-4 bottom-[4.5rem]" : "inset-0"}`}>
          {isCutout ? (
            <Parallax amount={16} className="relative w-full h-full">
              <Photo src={img} alt={title} imgClassName="object-contain drop-shadow-[0_22px_28px_rgba(0,0,0,.6)] transition-transform duration-700 ease-elegant group-hover:scale-[1.07]" />
            </Parallax>
          ) : (
            <Photo src={img} alt={title} imgClassName="object-cover transition-transform duration-700 ease-elegant group-hover:scale-[1.07]" />
          )}
        </div>
      )}
      {/* scrim keeps the caption readable over any artwork */}
      <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/85 via-black/40 to-transparent" />
      <div className="absolute left-5 bottom-5 right-5 text-white">
        <div className="flex items-center gap-2.5">
          <span className="w-7 h-7 rounded-full bg-accent/20 border border-accent/50 grid place-items-center shrink-0 transition-colors duration-300 group-hover:bg-accent/35">
            <span className="w-1.5 h-1.5 rounded-full bg-accent" />
          </span>
          <h3 className="font-display uppercase tracking-[.03em] text-[15px] sm:text-[17px]">{title}</h3>
        </div>
        <p className="text-white/70 text-[12.5px] mt-1.5 leading-snug">{desc}</p>
      </div>
    </div>
  );
}

function BrandCard({ brand, t, delay }: { brand: { name: string; labelKey: string; href: string; p: Product }; t: (k: string) => string; delay?: number }) {
  const img = brand.p.image;
  const isCutout = (img ?? "").endsWith(".png");
  return (
    <Reveal blur delay={delay}>
      <Link href={brand.href} className="group relative block overflow-hidden rounded-[1.4rem] min-h-[240px] sm:min-h-[270px] card-dark">
        <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-accent/20 blur-3xl" />
        {img && (
          <div className={`absolute ${isCutout ? "inset-x-3 top-4 bottom-16" : "inset-0"}`}>
            {isCutout ? (
              <Parallax amount={14} className="relative w-full h-full">
                <Photo src={img} alt={brand.name} imgClassName="object-contain drop-shadow-[0_22px_28px_rgba(0,0,0,.55)] transition-transform duration-700 ease-elegant group-hover:scale-105" />
              </Parallax>
            ) : (
              // No cutout for this brand — zoom into the promo card so its
              // burned-in wordmark and price crop out of frame.
              <Photo src={img} alt={brand.name} imgClassName="object-cover scale-[1.75] transition-transform duration-700 ease-elegant group-hover:scale-[1.85]" />
            )}
          </div>
        )}
        {!isCutout && <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />}
        <div className="absolute left-5 bottom-5 right-5 flex items-end justify-between text-white">
          <h3 className="font-display uppercase tracking-[.03em] text-[17px] sm:text-[19px] leading-none">{t(brand.labelKey)}</h3>
          <span className="w-9 h-9 rounded-full bg-white/15 backdrop-blur grid place-items-center group-hover:bg-accent transition-colors">
            <ArrowUpRight width={14} height={14} />
          </span>
        </div>
      </Link>
    </Reveal>
  );
}

function FreshRow({ wrap, title, cta, items }: { wrap: string; title: string; cta: string; items: Product[] }) {
  if (!items.length) return null;
  return (
    <section className={`${wrap} mt-14 sm:mt-20`}>
      <SectionHead title={title} href="/shop" cta={cta} />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 mt-6">
        {items.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
      </div>
    </section>
  );
}
