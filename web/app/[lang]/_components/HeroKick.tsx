"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { LocaleLink as Link } from "@/components/LocaleLink";
import { Photo } from "@/components/Photo";
import { ArrowUpRight, ChevronLeft } from "@/components/Icons";
import { useT } from "@/components/LangProvider";
import { Parallax } from "./Parallax";
import type { Product } from "@/lib/types";

// The KICKNOVA-style hero shoe (owner-provided cutout) is the default star;
// product cutouts fill the thumbnail switcher.
const HERO_IMG = "/hero.png";
const ease: [number, number, number, number] = [0.22, 0.61, 0.36, 1];
const container = { hidden: {}, show: { transition: { staggerChildren: 0.07, delayChildren: 0.04 } } };
const rise = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.6, ease } } };
const STROKE = { color: "transparent", WebkitTextStroke: "2px rgba(22,21,21,.82)" } as React.CSSProperties;

export function HeroKick({ products }: { products: Product[] }) {
  const t = useT();
  const slides = Array.from(new Set([HERO_IMG, ...products.map(p => p.image).filter(Boolean) as string[]])).slice(0, 4);
  const [active, setActive] = useState(0);
  const img = slides[active] ?? HERO_IMG;
  const go = (d: number) => setActive(a => (a + d + slides.length) % slides.length);

  const heroA = t("home.heroA");
  const heroB = t("home.heroB");

  // Floating spec labels (dot + pill), placed around the shoe on desktop.
  // `dir` = which side the sneaker sits on, so the connector points at it.
  const labels: { text: string; pos: string; dir: "left" | "right" }[] = [
    { text: t("home.f1"), pos: "left-[16%] top-[38%]", dir: "right" },
    { text: t("home.f2"), pos: "left-[57%] top-[46%]", dir: "left" },
    { text: t("home.f3"), pos: "left-[40%] top-[64%]", dir: "left" },
    { text: t("home.f4"), pos: "left-[11%] top-[70%]", dir: "right" },
  ];

  const Pill = ({ text, dir }: { text: string; dir?: "left" | "right" }) => {
    const line = (
      <span className="relative h-px w-9 bg-ink/25 shrink-0">
        <span className={`absolute -top-[3px] w-1.5 h-1.5 rounded-full bg-accent ${dir === "right" ? "right-0" : "left-0"}`} />
      </span>
    );
    return (
      <span className="inline-flex items-center">
        {dir === "left" && line}
        <span className="inline-flex items-center gap-2 bg-white/95 backdrop-blur border border-line rounded-pill h-8 px-3.5 text-[12px] font-semibold text-ink whitespace-nowrap shadow-[0_10px_24px_-10px_rgba(22,21,21,.4)]">
          {!dir && <span className="w-1.5 h-1.5 rounded-full bg-accent" />}{text}
        </span>
        {dir === "right" && line}
      </span>
    );
  };

  const CopyBlock = ({ center }: { center?: boolean }) => (
    <motion.div variants={container} initial="hidden" animate="show" className={center ? "text-center" : ""}>
      <motion.div variants={rise} className="font-display uppercase text-accent text-[30px] sm:text-[34px] leading-none tracking-tight">X-MAS</motion.div>
      <motion.p variants={rise} className={`text-muted text-[14px] mt-2 leading-relaxed ${center ? "mx-auto max-w-[360px]" : "max-w-[300px]"}`}>{t("home.heroDesc")}</motion.p>
      <motion.div variants={rise} className={`mt-5 flex items-center gap-3 ${center ? "justify-center" : ""}`}>
        <Link href="/shop" className="btn btn-primary">
          {t("home.shopNow")}
          <span className="arrow-cap bg-white/25 text-white"><ArrowUpRight width={14} height={14} /></span>
        </Link>
      </motion.div>
      {/* thumbnail switcher + arrows */}
      <motion.div variants={rise} className={`mt-6 flex items-center gap-2.5 ${center ? "justify-center" : ""}`}>
        <button onClick={() => go(-1)} aria-label="Prev" className="w-8 h-8 rounded-full border border-line bg-white grid place-items-center hover:border-ink/40 transition-colors">
          <ChevronLeft width={15} height={15} />
        </button>
        <div className="flex items-center gap-2">
          {slides.map((s, i) => (
            <button
              key={s} onClick={() => setActive(i)} aria-label={`Slide ${i + 1}`} aria-pressed={i === active}
              className={`relative w-12 h-12 rounded-2xl overflow-hidden bg-mist grid place-items-center transition-all duration-300 ease-spring hover:-translate-y-0.5 ${
                i === active ? "ring-2 ring-accent scale-105 shadow-soft" : "ring-1 ring-line hover:ring-ink/30"
              }`}
            >
              <Photo src={s} alt="" imgClassName="object-contain p-1.5" />
            </button>
          ))}
        </div>
        <button onClick={() => go(1)} aria-label="Next" className="w-8 h-8 rounded-full border border-line bg-white grid place-items-center hover:border-ink/40 transition-colors">
          <ChevronLeft width={15} height={15} className="rotate-180" />
        </button>
      </motion.div>
    </motion.div>
  );

  const Shoe = () => (
    <motion.div
      key={img}
      initial={{ opacity: 0, scale: 0.94, y: 8 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.7, ease }}
      className="relative w-full h-full grid place-items-center"
    >
      <Parallax amount={20} className="relative w-[92%] aspect-[3/2]">
        <div className="relative w-full h-full animate-floaty">
          <Photo src={img} alt={t("home.heroA")} priority sizes="(max-width:1024px) 90vw, 55vw" imgClassName="object-contain drop-shadow-[0_38px_42px_rgba(22,21,21,.28)]" />
        </div>
        {/* ground shadow */}
        <div className="absolute left-1/2 -translate-x-1/2 bottom-[-6%] w-[62%] h-[22px] rounded-[50%] bg-black/20 blur-xl" />
      </Parallax>
    </motion.div>
  );

  return (
    <section className="relative overflow-hidden rounded-[2rem] bg-white border border-line shadow-[0_30px_80px_-50px_rgba(22,21,21,.5)]">
      <div className="grain absolute inset-0 opacity-40 pointer-events-none" />

      {/* ============ DESKTOP STAGE ============ */}
      <div className="relative hidden lg:block h-[600px] z-10">
        {/* FUEL YOUR (solid, behind shoe) */}
        <motion.h1
          initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease }}
          className="absolute left-[3%] top-[9%] z-10 h-display text-ink"
        >{heroA}</motion.h1>
        {/* EVERY MOVE (outlined, behind the shoe so the sneaker crops it) */}
        <motion.div
          initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.08, ease }}
          style={STROKE}
          className="absolute left-[27%] top-[26%] z-10 h-display pointer-events-none select-none"
        >{heroB}</motion.div>

        {/* Shoe */}
        <div className="absolute left-[4%] top-[18%] w-[58%] h-[70%] z-20"><Shoe /></div>

        {/* Floating labels */}
        <div className="absolute inset-0 z-30 pointer-events-none">
          {labels.map((l, i) => (
            <motion.div
              key={l.text}
              initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.5 + i * 0.1, ease }}
              className={`absolute ${l.pos}`}
            ><Pill text={l.text} dir={l.dir} /></motion.div>
          ))}
        </div>

        {/* Right copy block */}
        <div className="absolute right-[2%] top-[50%] w-[32%] z-30"><CopyBlock /></div>
      </div>

      {/* ============ MOBILE / TABLET ============ */}
      <div className="lg:hidden relative z-10 px-5 sm:px-8 py-8 text-center">
        <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="eyebrow text-accent-deep">{t("home.newSeason")}</motion.span>
        <h1 className="h-display text-ink mt-2 leading-[.9]">
          {heroA} <span style={STROKE}>{heroB}</span>
        </h1>
        <div className="relative mx-auto w-full max-w-[420px] aspect-[3/2] mt-3">
          <Shoe />
        </div>
        <div className="flex flex-wrap items-center justify-center gap-2 mt-4">
          {labels.map(l => <Pill key={l.text} text={l.text} />)}
        </div>
        <div className="mt-6"><CopyBlock center /></div>
      </div>
    </section>
  );
}
