"use client";
import { LocaleLink as Link } from "@/components/LocaleLink";
import { NewsletterForm } from "@/components/NewsletterForm";
import { useT } from "./LangProvider";

const IgIcon = (p: any) => (
  <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" {...p}>
    <rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
  </svg>
);
const FbIcon = (p: any) => (
  <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor" {...p}>
    <path d="M22 12a10 10 0 1 0-11.6 9.9v-7H7.9V12h2.5V9.8c0-2.5 1.5-3.9 3.8-3.9 1.1 0 2.2.2 2.2.2v2.5h-1.3c-1.2 0-1.6.8-1.6 1.6V12h2.8l-.4 2.9h-2.4v7A10 10 0 0 0 22 12Z" />
  </svg>
);
const TwIcon = (p: any) => (
  <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor" {...p}>
    <path d="M21 5.9c-.7.3-1.4.5-2.2.6.8-.5 1.4-1.2 1.7-2.1-.7.4-1.6.8-2.4.9A3.7 3.7 0 0 0 12 8.6c0 .3 0 .6.1.8-3.1-.2-5.8-1.6-7.6-3.9-.3.6-.5 1.2-.5 1.9 0 1.3.7 2.4 1.7 3.1-.6 0-1.2-.2-1.7-.5 0 1.8 1.3 3.3 3 3.7-.3.1-.7.1-1 .1-.2 0-.5 0-.7-.1.5 1.5 1.9 2.6 3.5 2.6a7.4 7.4 0 0 1-5.5 1.5 10.4 10.4 0 0 0 5.7 1.7c6.8 0 10.5-5.6 10.5-10.5v-.5c.7-.5 1.3-1.2 1.8-2z" />
  </svg>
);
const YtIcon = (p: any) => (
  <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor" {...p}>
    <path d="M21.6 7.2a2.5 2.5 0 0 0-1.8-1.8C18.2 5 12 5 12 5s-6.2 0-7.8.4A2.5 2.5 0 0 0 2.4 7.2 26 26 0 0 0 2 12a26 26 0 0 0 .4 4.8 2.5 2.5 0 0 0 1.8 1.8C5.8 19 12 19 12 19s6.2 0 7.8-.4a2.5 2.5 0 0 0 1.8-1.8A26 26 0 0 0 22 12a26 26 0 0 0-.4-4.8ZM10 15V9l5.2 3L10 15Z" />
  </svg>
);

// Photo backdrop for the newsletter card — a row of product shots, kept bright
// enough to read as photography with only a light scrim over it.
const SHOTS = [
  "/products/converse-chuck70-hi-black.png",
  "/hero.png",
  "/products/converse-retro-trainer-burgundy.png",
];

export function Footer() {
  const t = useT();
  return (
    // `flow-root` stops the card's negative margin collapsing through and
    // dragging the footer's background up with it; the top margin exceeds the
    // pull-up so the card still has clear air above it.
    <footer className="relative flow-root mt-[190px] bg-ink text-white sm:mt-[240px]">
      <div className="mx-auto max-w-[1180px] px-5 sm:px-8">

        {/* ===== Newsletter card — straddles the footer's top edge ===== */}
        <div className="relative z-10 mx-auto -mt-[120px] max-w-[820px] overflow-hidden rounded-[1.75rem] sm:-mt-[160px] sm:rounded-[2rem]">
          <div className="absolute inset-0 bg-[#15161a]" />
          <div aria-hidden className="absolute inset-0 flex items-center justify-center gap-2 opacity-[.6]">
            {SHOTS.map(s => <img key={s} src={s} alt="" className="h-[115%] w-1/3 object-cover" />)}
          </div>
          {/* scrim: dark enough for the copy, light enough to keep the photo */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/55 to-black/75" />
          <div className="relative px-6 py-12 text-center sm:px-12 sm:py-16">
            <h2 className="text-[27px] font-bold italic leading-[1.08] tracking-tight drop-shadow-[0_2px_10px_rgba(0,0,0,.6)] sm:text-[40px]">{t("home.newsTitle")}</h2>
            <p className="mx-auto mt-3 max-w-[460px] text-[13px] leading-relaxed text-white/80 sm:text-[14.5px]">{t("home.newsDesc")}</p>
            <div className="mt-7"><NewsletterForm /></div>
          </div>
        </div>

        {/* ===== Footer body ===== */}
        <div className="grid grid-cols-2 gap-x-6 gap-y-10 pt-16 md:grid-cols-[1.5fr_1fr_1fr_1fr] md:gap-10">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            {/* the mark already carries the wordmark, so it stands alone here;
                it is pure black with alpha, so invert paints it white on the ink panel */}
            <Link href="/" aria-label="X-MAS" className="inline-block">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/logo.png" alt="X-MAS" className="h-16 w-auto object-contain brightness-0 invert transition-opacity hover:opacity-80" />
            </Link>
            <p className="mt-4 max-w-[280px] text-[13.5px] leading-relaxed text-white/55">{t("foot.tagline")}</p>

            <h5 className="mt-7 text-[13px] font-semibold text-white">{t("foot.social")}</h5>
            <div className="mt-3 flex items-center gap-4 text-accent">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="transition-transform duration-300 hover:-translate-y-0.5 hover:text-accent-deep"><FbIcon /></a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="transition-transform duration-300 hover:-translate-y-0.5 hover:text-accent-deep"><IgIcon /></a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter" className="transition-transform duration-300 hover:-translate-y-0.5 hover:text-accent-deep"><TwIcon /></a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="transition-transform duration-300 hover:-translate-y-0.5 hover:text-accent-deep"><YtIcon /></a>
            </div>
          </div>

          <FootCol title={t("bc.shop")} links={[
            ["/shop", t("cat.all")],
            ["/shop?filter=new", t("home.newArrivals")],
            ["/shop?filter=sale", t("nav.accessories")],
          ]} />
          <FootCol title={t("foot.links")} links={[
            ["mailto:support@xmas.mn", t("foot.contact")],
            ["/refund-policy", t("foot.refund")],
            ["/terms", t("foot.terms")],
            ["/privacy", t("foot.privacy")],
          ]} />
          <FootCol title={t("foot.brand")} links={[
            ["/shop?category=Converse", t("cat.Converse")],
            ["/shop?category=UGG", t("cat.UGG")],
            ["/shop?category=The%20North%20Face", t("cat.The North Face")],
          ]} />
        </div>

        {/* ===== Giant outlined watermark, clipped by its own box ===== */}
        <div aria-hidden className="relative mt-12 h-[70px] overflow-hidden sm:h-[120px]">
          <span
            className="pointer-events-none absolute left-1/2 top-0 -translate-x-1/2 select-none whitespace-nowrap font-display uppercase leading-[.76] tracking-[.04em] text-[30vw]"
            style={{ color: "transparent", WebkitTextStroke: "2px rgba(241,89,43,.45)" }}
          >X-MAS</span>
        </div>

        {/* ===== Legal row ===== */}
        <div className="relative flex flex-col-reverse items-center gap-3 border-t border-white/10 py-6 text-[12.5px] text-white/45 sm:flex-row sm:justify-between">
          <span>{t("foot.rights")}</span>
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-1">
            <Link href="/privacy" className="transition-colors hover:text-accent">{t("foot.privacy")}</Link>
            <Link href="/terms" className="transition-colors hover:text-accent">{t("foot.terms")}</Link>
            <Link href="/refund-policy" className="transition-colors hover:text-accent">{t("foot.refund")}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FootCol({ title, links }: { title: string; links: [string, string][] }) {
  return (
    <div>
      <h5 className="mb-4 text-[13.5px] font-semibold text-white">{title}</h5>
      <ul className="space-y-3">
        {links.map(([h, l]) => (
          <li key={l}>
            {h.startsWith("mailto:")
              ? <a href={h} className="text-[13.5px] text-white/55 transition-colors hover:text-accent">{l}</a>
              : <Link href={h} className="text-[13.5px] text-white/55 transition-colors hover:text-accent">{l}</Link>}
          </li>
        ))}
      </ul>
    </div>
  );
}
