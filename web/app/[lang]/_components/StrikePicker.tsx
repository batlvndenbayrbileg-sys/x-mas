"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LocaleLink as Link } from "@/components/LocaleLink";
import { Photo } from "@/components/Photo";
import { useCart, useToast, flyToCart } from "@/lib/store";
import { money } from "@/lib/api";
import { useT } from "@/components/LangProvider";
import type { Product } from "@/lib/types";

const ease: [number, number, number, number] = [0.22, 0.61, 0.36, 1];

function StrikeCard({ product }: { product: Product }) {
  const t = useT();
  const add = useCart(s => s.add);
  const showToast = useToast(s => s.show);
  const colors = (product.colors?.length ? product.colors : [product.accent]).slice(0, 5);

  return (
    <div className="flex flex-col text-left">
      {/* product shot on a bright court tile */}
      <Link href={`/product/${product.slug}`} className="group relative block overflow-hidden rounded-[1.5rem] bg-white border border-ink/10">
        <div className="relative aspect-[4/3] overflow-hidden">
          <Photo
            src={product.image}
            alt={product.name}
            sizes="(max-width:1024px) 92vw, 44vw"
            imgClassName="object-contain p-3 scale-110 transition-transform duration-700 ease-elegant group-hover:scale-[1.18]"
          />
        </div>
      </Link>

      <h3 className="h-strike-2 mt-5 text-ink">{product.name}</h3>
      <div className="mt-1 flex items-baseline gap-2">
        <span className="font-strike text-[22px] italic text-accent num-tabular">{money(product.price)}</span>
        {product.was && <span className="text-[14px] text-ink/40 line-through num-tabular">{money(product.was)}</span>}
      </div>
      <p className="mt-3 max-w-[460px] text-[13.5px] leading-relaxed text-ink/70">{product.shortDesc || product.description}</p>

      {/* colourways */}
      <div className="mt-4 flex items-center gap-2">
        {colors.map((c, i) => (
          <span key={`${c}-${i}`} className="h-5 w-5 rounded-full ring-1 ring-ink/15" style={{ background: c }} />
        ))}
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <Link href={`/product/${product.slug}`} className="pill-ghost !h-11 !px-6 !text-[13px]">{t("strike.selectSize")}</Link>
        <button
          onClick={(e) => { add(product); flyToCart(e.currentTarget, product.accent); showToast(`${product.name} · ${t("strike.addToCart")}`); }}
          className="pill-cta !h-11 !px-6 !text-[13px]"
        >
          {t("strike.addToCart")}
        </button>
      </div>
    </div>
  );
}

/** MEN'S / WOMEN'S switch over a pair of featured sneakers, as on the reference. */
export function StrikePicker({ men, women }: { men: Product[]; women: Product[] }) {
  const t = useT();
  const [tab, setTab] = useState<"men" | "women">("men");
  const items = (tab === "men" ? men : women).slice(0, 2);
  if (!men.length && !women.length) return null;

  const Tab = ({ id, label }: { id: "men" | "women"; label: string }) => (
    <button
      onClick={() => setTab(id)}
      aria-pressed={tab === id}
      className={`relative pb-2 font-strike text-[20px] sm:text-[26px] italic uppercase tracking-tight transition-colors ${
        tab === id ? "text-accent" : "text-ink/35 hover:text-ink/60"
      }`}
    >
      {label}
      {tab === id && <motion.span layoutId="strike-tab" className="absolute inset-x-0 -bottom-px h-[3px] rounded-full bg-accent" />}
    </button>
  );

  return (
    <>
      <div className="flex items-center justify-center gap-8">
        <Tab id="men" label={t("strike.men")} />
        <Tab id="women" label={t("strike.women")} />
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={tab}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.36, ease }}
          className="mt-10 grid grid-cols-1 gap-10 md:grid-cols-2 md:gap-8"
        >
          {items.map(p => <StrikeCard key={p.id} product={p} />)}
        </motion.div>
      </AnimatePresence>
    </>
  );
}
