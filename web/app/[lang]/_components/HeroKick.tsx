"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { LocaleLink as Link } from "@/components/LocaleLink";
import { Photo } from "@/components/Photo";
import { ArrowUpRight } from "@/components/Icons";
import { useT } from "@/components/LangProvider";
import { Parallax } from "./Parallax";
import type { Product } from "@/lib/types";

const ease: [number, number, number, number] = [0.22, 0.61, 0.36, 1];
const container = { hidden: {}, show: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } } };
const rise = { hidden: { opacity: 0, y: 22 }, show: { opacity: 1, y: 0, transition: { duration: 0.6, ease } } };

export function HeroKick({ products }: { products: Product[] }) {
  const t = useT();
  const items = products.slice(0, 4);
  const [active, setActive] = useState(0);
  const hero = items[active] ?? products[0];
  if (!hero) return null;

  const pills = [t("home.f1"), t("home.f2"), t("home.f3"), t("home.f4")];

  return (
    <section className="relative overflow-hidden rounded-[2rem] bg-white border border-line shadow-[0_30px_80px_-50px_rgba(22,21,21,.5)]">
      <div className="grain absolute inset-0 opacity-40 pointer-events-none" />
      {/* giant ghost brand wordmark, low in the panel — drifts on scroll for depth */}
      <Parallax amount={-28} className="pointer-events-none absolute inset-x-0 bottom-[-4%] z-0 text-right pr-6">
        <span aria-hidden className="select-none font-display uppercase text-[24vw] lg:text-[15rem] leading-[.7] text-ink/[.035] whitespace-nowrap">SNEAKERS</span>
      </Parallax>

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-[1fr_1.05fr] items-center gap-4 p-5 sm:p-8 lg:pl-12 lg:pr-8 lg:py-12 min-h-[440px] lg:min-h-[560px]">
        {/* Left — copy */}
        <motion.div variants={container} initial="hidden" animate="show" className="relative z-20 order-2 lg:order-1">
          <motion.span variants={rise} className="eyebrow text-accent-deep">{t("home.newSeason")}</motion.span>
          <motion.h1 variants={rise} className="h-display leading-[.82] mt-3">
            {t("home.heroA")}<br />
            <span className="ghost-strong">{t("home.heroB")}</span>
          </motion.h1>
          <motion.p variants={rise} className="text-muted text-[15px] mt-5 max-w-[400px] leading-relaxed">{t("home.heroDesc")}</motion.p>

          <motion.div variants={rise} className="flex flex-wrap gap-2 mt-6">
            {pills.map(p => (
              <span key={p} className="inline-flex items-center gap-2 bg-mist border border-line rounded-pill pl-2.5 pr-3.5 h-8 text-[12px] font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-accent" />{p}
              </span>
            ))}
          </motion.div>

          <motion.div variants={rise} className="mt-8">
            <Link href="/shop" className="btn btn-primary">
              {t("home.shopNow")}
              <span className="arrow-cap bg-white/25 text-white"><ArrowUpRight width={14} height={14} /></span>
            </Link>
          </motion.div>
        </motion.div>

        {/* Right — big floating cutout shoe */}
        <div className="order-1 lg:order-2">
          <div className="relative mx-auto w-full max-w-[540px] aspect-[4/3]">
            {/* accent halo */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[94%] aspect-square rounded-full bg-accent-soft" />
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[102%] aspect-square rounded-full ring-1 ring-accent/15" />

            {/* shoe */}
            <motion.div
              key={hero.id}
              initial={{ opacity: 0, scale: 0.92, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.7, ease }}
              className="absolute inset-0 grid place-items-center"
            >
              <Parallax amount={22} className="relative w-[88%] aspect-[4/3]">
                <div className="relative w-full h-full -rotate-[7deg] animate-floaty">
                  <Photo
                    src={hero.image}
                    alt={hero.name}
                    priority
                    sizes="(max-width:1024px) 90vw, 45vw"
                    imgClassName="object-contain drop-shadow-[0_40px_45px_rgba(22,21,21,.3)]"
                  />
                </div>
              </Parallax>
            </motion.div>

            {/* badge */}
            <span className="absolute top-2 left-2 z-20 bg-white/90 backdrop-blur border border-line text-ink text-[11px] uppercase tracking-[.12em] font-semibold px-3 h-7 rounded-pill inline-grid place-items-center">{hero.category}</span>
          </div>

          {/* thumbnails */}
          <div className="flex items-center justify-center gap-2.5 mt-5">
            {items.map((p, i) => (
              <button
                key={p.id}
                onClick={() => setActive(i)}
                aria-label={p.name}
                aria-pressed={i === active}
                className={`relative w-14 h-14 rounded-2xl overflow-hidden bg-white grid place-items-center transition-all duration-300 ease-spring hover:-translate-y-0.5 ${
                  i === active ? "ring-2 ring-accent scale-105 shadow-soft" : "ring-1 ring-line hover:ring-ink/30"
                }`}
              >
                <Photo src={p.image} alt="" imgClassName="object-contain p-1.5" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
