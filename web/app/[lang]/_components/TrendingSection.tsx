"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LocaleLink as Link } from "@/components/LocaleLink";
import { Photo } from "@/components/Photo";
import { HeartIcon, ArrowRight, ChevronLeft } from "@/components/Icons";
import { useWish } from "@/lib/store";
import { money } from "@/lib/api";
import { useT } from "@/components/LangProvider";
import type { Product } from "@/lib/types";

const ease: [number, number, number, number] = [0.22, 0.61, 0.36, 1];
const PER_PAGE = 5; // 1 featured + 4 in the grid

/** Heart toggle shared by both card sizes. */
function Wish({ id, name, small }: { id: string; name: string; small?: boolean }) {
  const toggle = useWish(s => s.toggle);
  const has = useWish(s => s.has);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const wished = mounted && has(id);
  const t = useT();
  return (
    <button
      onClick={(e) => { e.preventDefault(); toggle(id); }}
      aria-label={`${t("nav.wishlist")}: ${name}`}
      aria-pressed={wished}
      className={`shrink-0 grid place-items-center rounded-full transition-all duration-200 active:scale-90 ${
        small ? "w-8 h-8" : "w-10 h-10"
      } ${wished ? "text-red-500 bg-red-50" : "text-accent bg-accent-soft/70 hover:bg-accent-soft"}`}
    >
      <HeartIcon width={small ? 14 : 17} height={small ? 14 : 17} filled={wished} />
    </button>
  );
}

/** Size chips + colour dots — the little spec row at the card's bottom-left. */
function Specs({ product, small }: { product: Product; small?: boolean }) {
  const sizes = (product.sizes ?? []).slice(0, 3);
  const colors = (product.colors?.length ? product.colors : [product.accent]).slice(0, 4);
  return (
    <div className="min-w-0">
      {sizes.length > 0 && (
        <div className="flex items-center gap-1.5">
          {sizes.map(s => (
            <span key={s} className={`grid place-items-center rounded-full border border-line text-ink/70 num-tabular ${
              small ? "h-5 min-w-[22px] px-1 text-[9.5px]" : "h-6 min-w-[26px] px-1.5 text-[11px]"
            }`}>{s}</span>
          ))}
        </div>
      )}
      <div className={`flex items-center gap-1.5 ${sizes.length ? (small ? "mt-1.5" : "mt-2") : ""}`}>
        {colors.map((c, i) => (
          <span key={`${c}-${i}`} className={`rounded-full ring-1 ring-ink/10 ${small ? "w-3 h-3" : "w-3.5 h-3.5"}`} style={{ background: c }} />
        ))}
      </div>
    </div>
  );
}

/** Round accent CTA that mirrors the reference's orange arrow button. */
function GoButton({ small }: { small?: boolean }) {
  return (
    <span className={`shrink-0 grid place-items-center rounded-full bg-accent text-white transition-all duration-300 ease-spring group-hover:bg-accent-deep group-hover:scale-105 shadow-[0_10px_26px_-8px_rgba(241,89,43,.65)] ${
      small ? "w-9 h-9" : "w-14 h-14"
    }`}>
      <ArrowRight width={small ? 15 : 22} height={small ? 15 : 22} />
    </span>
  );
}

function TrendCard({ product, featured }: { product: Product; featured?: boolean }) {
  const isCutout = (product.image ?? "").endsWith(".png");
  const small = !featured;
  return (
    <Link
      href={`/product/${product.slug}`}
      className={`group relative flex flex-col rounded-[1.5rem] bg-white border border-line transition-[transform,box-shadow] duration-500 ease-elegant hover:-translate-y-1 hover:shadow-deep ${
        featured ? "p-5 sm:p-6" : "p-3.5 sm:p-4"
      }`}
    >
      {/* name + price, heart on the right */}
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className={`text-ink leading-tight group-hover:text-accent-deep transition-colors ${
            featured ? "text-[21px] sm:text-[25px] font-semibold" : "text-[13px] sm:text-[14px] font-semibold line-clamp-2"
          }`}>{product.name}</h3>
          <div className={`num-tabular text-accent font-bold ${featured ? "text-[19px] sm:text-[21px] mt-1.5" : "text-[13px] mt-1"}`}>
            {money(product.price)}
            {product.was && <span className="ml-1.5 text-muted/70 font-medium line-through text-[11px]">{money(product.was)}</span>}
          </div>
        </div>
        <Wish id={product.id} name={product.name} small={small} />
      </div>

      {/* product shot */}
      <div className={`relative w-full overflow-hidden ${featured ? "flex-1 min-h-[300px] sm:min-h-[380px] my-3" : "aspect-[3/2] my-2"}`}>
        <Photo
          src={product.image}
          alt={product.name}
          sizes={featured ? "(max-width:1024px) 90vw, 40vw" : "(max-width:1024px) 45vw, 20vw"}
          imgClassName={`transition-transform duration-700 ease-elegant ${
            isCutout
              ? "object-contain group-hover:scale-[1.07]"
              : "object-cover rounded-[1rem] group-hover:scale-[1.07]"
          }`}
        />
      </div>

      {/* specs + CTA */}
      <div className="flex items-end justify-between gap-3 mt-auto">
        <Specs product={product} small={small} />
        <GoButton small={small} />
      </div>
    </Link>
  );
}

export function TrendingSection({ products, title, seeAll, seeAllHref = "/shop" }: {
  products: Product[]; title: string; seeAll: string; seeAllHref?: string;
}) {
  const pages = Math.max(1, Math.ceil(products.length / PER_PAGE));
  const [page, setPage] = useState(0);
  const go = (d: number) => setPage(p => (p + d + pages) % pages);
  const slice = products.slice(page * PER_PAGE, page * PER_PAGE + PER_PAGE);
  const [featured, ...rest] = slice;
  if (!featured) return null;

  return (
    <>
      {/* header: title left, pager right */}
      <div className="flex items-end justify-between gap-4">
        <h2 className="hd-2">{title}</h2>
        <div className="flex items-center gap-2 shrink-0">
          <Link href={seeAllHref} className="chip hidden sm:inline-flex">{seeAll}</Link>
          {pages > 1 && (
            <>
              <button onClick={() => go(-1)} aria-label="Previous" className="w-10 h-10 rounded-full border border-line bg-white text-ink grid place-items-center hover:border-ink/40 hover:-translate-y-0.5 transition-all duration-300 ease-spring">
                <ChevronLeft width={16} height={16} />
              </button>
              <button onClick={() => go(1)} aria-label="Next" className="w-10 h-10 rounded-full bg-accent text-white grid place-items-center hover:bg-accent-deep hover:-translate-y-0.5 transition-all duration-300 ease-spring shadow-[0_10px_26px_-8px_rgba(241,89,43,.65)]">
                <ChevronLeft width={16} height={16} className="rotate-180" />
              </button>
            </>
          )}
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={page}
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.38, ease }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5 mt-6"
        >
          <TrendCard product={featured} featured />
          <div className="grid grid-cols-2 gap-4 sm:gap-5">
            {rest.map(p => <TrendCard key={p.id} product={p} />)}
          </div>
        </motion.div>
      </AnimatePresence>
    </>
  );
}
