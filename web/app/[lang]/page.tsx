import { LocaleLink as Link } from "@/components/LocaleLink";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { ProductCard } from "@/components/ProductCard";
import type { Product } from "@/lib/types";
import { Photo } from "@/components/Photo";
import { ArrowUpRight, ArrowRight } from "@/components/Icons";
import { api, money } from "@/lib/api";
import { NewsletterForm } from "./_components/NewsletterForm";
import { Reveal } from "./_components/Reveal";
import { HeroKick } from "./_components/HeroKick";
import { Countdown } from "./_components/Countdown";
import { BrandMarquee } from "./_components/BrandMarquee";
import { Testimonials3D } from "./_components/Testimonials3D";
import { Parallax } from "./_components/Parallax";
import { ScrollProgress } from "./_components/ScrollProgress";
import { CoverflowCarousel } from "@/components/ui/coverflow-carousel";
import { tFor, type Lang } from "@/lib/i18n";

export const revalidate = 300;

export default async function HomePage({ params }: { params: { lang: Lang } }) {
  const t = tFor(params.lang);
  const res = await api.products.list({}).catch(() => ({ data: [] as Product[] }));
  const all = res.data;

  const trendFeatured = all.find(p => p.slug === "converse-suede-low-black") || all.find(p => p.badge === "Sale") || all[0];
  const trending = all.filter(p => p.id !== trendFeatured?.id).slice(0, 4);
  const vibe = all.slice(6, 14);
  const newArrivals = [all.find(p => p.slug === "converse-chuck-low-black-stars"), ...all.filter(p => p.badge === "New"), ...all].filter(Boolean).filter((p, i, a) => a.findIndex(x => x!.id === p!.id) === i).slice(0, 5) as Product[];
  const hiTops = all.filter(p => p.shape === "hightop").slice(0, 4);
  const lowTops = all.filter(p => p.shape === "lowtop").slice(0, 4);
  const nb = all.filter(p => p.category === "New Balance");
  const limited = nb[0] || all[0];
  // Prefer transparent cutouts (clean floating shoe) for the hero.
  const heroSet = [
    all.find(p => p.slug === "converse-chuck70-hi-black"),
    all.find(p => p.slug === "converse-chuck-low-blue-check"),
    all.find(p => p.slug === "converse-star-player-burgundy"),
    all.find(p => p.slug === "converse-retro-trainer-burgundy"),
  ].filter(Boolean) as Product[];

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

        {/* ===== TRENDING ===== */}
        <section className={`${wrap} mt-14 sm:mt-20`}>
          <SectionHead title={t("home.trending")} href="/shop" cta={t("common.seeAll")} />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5 mt-6">
            {trendFeatured && <Reveal blur><FeaturedCard product={trendFeatured} t={t} /></Reveal>}
            <div className="grid grid-cols-2 gap-4 sm:gap-5">
              {trending.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
            </div>
          </div>
        </section>

        {/* ===== PRODUCT FEATURES ===== */}
        <section className={`${wrap} mt-16 sm:mt-24`}>
          <Reveal>
            <h2 className="hd-2">{t("home.features")}</h2>
            <p className="text-muted mt-1">{t("home.featuresSub")}</p>
          </Reveal>
          <Reveal blur className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
            <FeatureCard img={all.find(p=>p.slug==="converse-chuck-low-blue-check")?.image} title={t("home.feat1")} desc={t("home.feat1d")} />
            <FeatureCard img={all.find(p=>p.slug==="converse-star-player-burgundy")?.image} title={t("home.feat3")} desc={t("home.feat3d")} />
          </Reveal>
          <Reveal blur delay={0.08} className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
            <FeatureCard img={all.find(p=>p.slug==="converse-chuck70-hi-black")?.image} title={t("home.feat2")} desc={t("home.feat2d")} small />
            <FeatureCard img={all.find(p=>p.slug==="converse-retro-trainer-burgundy")?.image} title={t("home.feat4")} desc={t("home.feat4d")} small />
            <FeatureCard img={all.find(p=>p.slug==="converse-chuck-low-black-stars")?.image} title={t("home.feat5")} desc={t("home.feat5d")} small />
          </Reveal>
        </section>

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

        {/* ===== NEWSLETTER ===== */}
        <section className={`${wrap} mt-16 sm:mt-24 mb-6`}>
          <Reveal blur>
          <div className="relative overflow-hidden rounded-[2rem] bg-accent-soft border border-accent/20 p-8 sm:p-12 text-center">
            <span className="text-[11px] uppercase tracking-[.24em] font-semibold text-accent-deep">{t("home.newsKicker")}</span>
            <h2 className="hd-2 mt-2 text-ink">{t("home.newsTitle")}</h2>
            <p className="text-ink/65 mt-2 max-w-[440px] mx-auto">{t("home.newsDesc")}</p>
            <div className="mt-6 max-w-[440px] mx-auto"><NewsletterForm /></div>
          </div>
          </Reveal>
        </section>
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

function FeatureCard({ img, title, desc, small }: { img?: string; title: string; desc: string; small?: boolean }) {
  const isCutout = (img ?? "").endsWith(".png");
  return (
    <div className={`group relative overflow-hidden rounded-[1.4rem] ${small ? "min-h-[200px]" : "min-h-[240px]"} card-dark`}>
      {/* soft accent glow top-right */}
      <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-accent/20 blur-3xl" />
      {img && (
        <div className={`absolute ${isCutout ? "inset-x-2 top-2 bottom-16" : "inset-0"}`}>
          {isCutout ? (
            <Parallax amount={16} className="relative w-full h-full">
              <Photo src={img} alt={title} imgClassName="object-contain drop-shadow-[0_20px_24px_rgba(0,0,0,.5)] transition-transform duration-700 ease-elegant group-hover:scale-105" />
            </Parallax>
          ) : (
            <Photo src={img} alt={title} imgClassName="object-cover transition-transform duration-700 ease-elegant group-hover:scale-105" />
          )}
        </div>
      )}
      {!isCutout && <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />}
      <div className="absolute left-5 bottom-5 right-5 text-white">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-accent" />
          <h3 className="font-display uppercase tracking-[.03em] text-[16px]">{title}</h3>
        </div>
        <p className="text-white/65 text-[12.5px] mt-1 leading-snug">{desc}</p>
      </div>
    </div>
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
