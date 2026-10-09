"use client";
import { useEffect, useState } from "react";
import { LocaleLink as Link } from "@/components/LocaleLink";
import { Photo } from "@/components/Photo";
import { HeartIcon, ArrowRight } from "@/components/Icons";
import { useWish } from "@/lib/store";
import { money } from "@/lib/api";
import { useT } from "@/components/LangProvider";
import type { Product } from "@/lib/types";

function Wish({ id, name }: { id: string; name: string }) {
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
      className={`grid h-9 w-9 shrink-0 place-items-center rounded-full transition-all active:scale-90 ${
        wished ? "bg-red-50 text-red-500" : "bg-accent-soft/70 text-accent hover:bg-accent-soft"
      }`}
    >
      <HeartIcon width={15} height={15} filled={wished} />
    </button>
  );
}

const Go = ({ big }: { big?: boolean }) => (
  <span className={`grid shrink-0 place-items-center rounded-full bg-accent text-white shadow-[0_10px_24px_-8px_rgba(241,89,43,.65)] transition-all duration-300 ease-spring group-hover:bg-accent-deep group-hover:scale-105 ${
    big ? "h-12 w-12" : "h-9 w-9"
  }`}>
    <ArrowRight width={big ? 19 : 15} height={big ? 19 : 15} />
  </span>
);

/** Compact product tile: name · price · wishlist · shot · CTA. */
function FitCard({ product }: { product: Product }) {
  return (
    <Link
      href={`/product/${product.slug}`}
      className="group flex flex-col rounded-[1.25rem] border border-line bg-white p-3.5 transition-[transform,box-shadow] duration-500 ease-elegant hover:-translate-y-1 hover:shadow-deep"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <h3 className="truncate text-[13px] font-semibold leading-tight text-ink group-hover:text-accent-deep">{product.name}</h3>
          <div className="num-tabular text-[13px] font-bold text-accent">{money(product.price)}</div>
        </div>
        <Wish id={product.id} name={product.name} />
      </div>
      <div className="relative my-1.5 aspect-[3/2] flex-1 overflow-hidden">
        <Photo
          src={product.image}
          alt={product.name}
          sizes="(max-width:1024px) 45vw, 22vw"
          imgClassName="object-contain transition-transform duration-700 ease-elegant group-hover:scale-[1.08]"
        />
      </div>
      <div className="flex justify-end"><Go /></div>
    </Link>
  );
}

/**
 * Bento row: one oversized hero tile beside a 2x2 of product tiles.
 * `reverse` flips the hero to the right, so alternating rows don't read the same.
 */
export function FreshFits({ products, title, href, reverse }: {
  products: Product[]; title: string; href: string; reverse?: boolean;
}) {
  const t = useT();
  if (products.length < 2) return null;
  const [hero, ...rest] = products;
  const cards = rest.slice(0, 4);

  return (
    <>
      <div className="flex items-end justify-between gap-4">
        <h2 className="font-display text-[22px] uppercase tracking-[.01em] text-ink sm:text-[32px]">{title}</h2>
        <Link href={href} className="chip shrink-0">{t("home.exploreMore")} <ArrowRight width={13} height={13} /></Link>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Link
          href={`/product/${hero.slug}`}
          className={`group relative col-span-2 row-span-2 flex min-h-[280px] flex-col justify-between overflow-hidden rounded-[1.5rem] bg-accent-soft p-5 sm:min-h-[360px] ${
            reverse ? "lg:col-start-3 lg:row-start-1" : ""
          }`}
        >
          <div className="relative z-10 flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h3 className="font-strike text-[20px] italic uppercase leading-none text-ink sm:text-[26px]">{hero.name}</h3>
              <div className="num-tabular mt-1.5 text-[16px] font-bold text-accent-deep">{money(hero.price)}</div>
            </div>
            <Go big />
          </div>
          <div className="pointer-events-none absolute inset-x-2 bottom-2 top-12">
            <Photo
              src={hero.image}
              alt={hero.name}
              sizes="(max-width:1024px) 92vw, 46vw"
              imgClassName="object-contain drop-shadow-[0_30px_34px_rgba(22,21,21,.25)] transition-transform duration-700 ease-elegant group-hover:scale-[1.06]"
            />
          </div>
        </Link>

        {cards.map(p => <FitCard key={p.id} product={p} />)}
      </div>
    </>
  );
}
