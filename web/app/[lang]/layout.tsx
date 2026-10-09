import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Oswald, Rubik, JetBrains_Mono, Fira_Sans_Extra_Condensed } from "next/font/google";
import "../globals.css";
import { Toast } from "@/components/Toast";
import { MobileTabBar } from "@/components/MobileTabBar";
import { CartDrawer } from "@/components/CartDrawer";
import { QuickViewModal } from "@/components/QuickViewModal";
import { FlyLayer } from "@/components/FlyLayer";
import { SmoothScroll } from "@/components/SmoothScroll";
import { LangProvider } from "@/components/LangProvider";
import { Consent } from "@/components/Consent";
import { LOCALES, isLang, tFor } from "@/lib/i18n";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://xmas.mn"),
  // Tab label is the bare wordmark; the descriptive line lives in the
  // description and the Open Graph title, where search and link previews use it.
  title: "X-MAS",
  description: "Converse, UGG, The North Face — оригинал пүүз, гутал, куртик нэг дороос. QPay-ээр төлж, хурдан хүргүүлээрэй.",
  openGraph: {
    title: "X-MAS — Оригинал пүүз, гутал, куртик",
    description: "Converse, UGG, The North Face — оригинал пүүз, гутал, куртик нэг дороос.",
    type: "website",
    siteName: "X-MAS",
  },
};

// Pre-render both locales → static/ISR pages, no cookies() (fast LCP).
export function generateStaticParams() {
  return LOCALES.map(lang => ({ lang }));
}

// Self-hosted via next/font: no render-blocking external CSS, no FOUT (swap + fallback).
// Only the weights actually used are requested — trims the font payload for a faster LCP.
// Condensed athletic display for headings — full Cyrillic (Mongolian) support.
const oswald = Oswald({ subsets: ["latin", "cyrillic"], weight: ["500", "600", "700"], variable: "--font-oswald", display: "swap" });
const rubik = Rubik({ subsets: ["latin", "cyrillic"], weight: ["400", "500", "600", "700"], variable: "--font-rubik", display: "swap" });
// Landing display face. Needs a real italic (not a synthesized slant) and full
// Mongolian Cyrillic — Alumni Sans looks closer to the reference but has no Ү/Ө.
const strike = Fira_Sans_Extra_Condensed({ subsets: ["latin", "cyrillic"], weight: ["700", "800"], style: ["normal", "italic"], variable: "--font-strike", display: "swap" });
const mono = JetBrains_Mono({ subsets: ["latin"], weight: ["400", "500"], variable: "--font-jetbrains", display: "swap" });

export default function LangLayout({ children, params }: { children: React.ReactNode; params: { lang: string } }) {
  if (!isLang(params.lang)) notFound();
  const lang = params.lang;
  const t = tFor(lang);
  return (
    <html lang={lang} className={`${oswald.variable} ${rubik.variable} ${mono.variable} ${strike.variable}`}>
      <body className="font-sans pb-24 lg:pb-0">
        <a href="#main" className="skip-link">{t("a11y.skip")}</a>
        <LangProvider lang={lang}>
          <SmoothScroll />
          <main id="main">{children}</main>
          <Toast />
          <CartDrawer />
          <QuickViewModal />
          <FlyLayer />
          <MobileTabBar />
          <Consent />
        </LangProvider>
      </body>
    </html>
  );
}
