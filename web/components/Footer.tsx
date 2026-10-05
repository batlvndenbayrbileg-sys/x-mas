"use client";
import { LocaleLink as Link } from "@/components/LocaleLink";
import { useT } from "./LangProvider";

const IgIcon = (p: any) => (
  <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="1.7" {...p}>
    <rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
  </svg>
);
const FbIcon = (p: any) => (
  <svg viewBox="0 0 24 24" width="17" height="17" fill="currentColor" {...p}>
    <path d="M13.5 21v-7h2.3l.4-2.8h-2.7V9.4c0-.8.24-1.35 1.4-1.35H16.3V5.5c-.26-.03-1.15-.11-2.18-.11-2.16 0-3.62 1.3-3.62 3.7v2.1H8.2V14h2.3v7h3z" />
  </svg>
);
const MailIcon = (p: any) => (
  <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.7" {...p}>
    <rect x="3" y="5" width="18" height="14" rx="2.5" /><path d="m4 7 8 6 8-6" />
  </svg>
);
const PhoneIcon = (p: any) => (
  <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.7" {...p}>
    <path d="M6.5 3.5 9 4l1 3.5-2 1.5a12 12 0 0 0 5 5l1.5-2 3.5 1 .5 2.5a2 2 0 0 1-2.2 2A15.5 15.5 0 0 1 4.5 5.7 2 2 0 0 1 6.5 3.5Z" />
  </svg>
);

export function Footer() {
  const t = useT();
  return (
    <footer className="relative z-10 mx-3 mb-3 overflow-hidden rounded-[1.75rem] bg-ink px-6 pt-12 pb-8 text-white sm:mx-4 sm:rounded-[2.25rem] sm:px-10 lg:mx-5">
      <div className="relative mx-auto max-w-[1180px]">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4 md:gap-10">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-accent" />
              <span className="font-display text-2xl uppercase tracking-[.06em]"><span className="text-accent">X</span>-MAS</span>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-white/55 max-w-[240px]">{t("foot.tagline")}</p>
            <div className="mt-5 flex flex-col gap-2">
              <a href="tel:+97677000329" className="inline-flex items-center gap-2 text-sm text-white/70 hover:text-accent transition-colors"><PhoneIcon className="text-accent" /> {t("foot.phone")}</a>
              <a href="mailto:support@xmas.mn" className="inline-flex items-center gap-2 text-sm text-white/70 hover:text-accent transition-colors"><MailIcon className="text-accent" /> support@xmas.mn</a>
            </div>
            <div className="mt-5 flex gap-2.5">
              <Social href="https://instagram.com" label="Instagram"><IgIcon /></Social>
              <Social href="https://facebook.com" label="Facebook"><FbIcon /></Social>
            </div>
          </div>

          <FootCol title={t("foot.brand")} links={[["/shop?category=Converse", t("cat.Converse")], ["/shop?category=New%20Balance", t("cat.New Balance")], ["/shop?category=UGG", t("cat.UGG")], ["/shop?category=The%20North%20Face", t("cat.The North Face")], ["/shop?filter=sale", t("nav.accessories")]]} />
          <FootCol title={t("foot.support")} links={[["/shop", t("bc.shop")], ["/refund-policy", t("foot.refund")], ["/terms", t("foot.terms")], ["/privacy", t("foot.privacy")]]} />
          <div>
            <h5 className="mb-4 text-[11px] font-semibold uppercase tracking-[.2em] text-accent">{t("foot.payments")}</h5>
            <div className="flex flex-wrap gap-2">
              {["QPay", "Хаан", "TDB", "Голомт", "Storepay"].map(m => (
                <span key={m} className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-[12px] text-white/70">{m}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Big watermark — sits behind, clipped by the footer's rounded box */}
        <span aria-hidden className="pointer-events-none select-none absolute -bottom-6 sm:-bottom-10 left-1/2 -translate-x-1/2 font-display uppercase tracking-[.02em] text-[26vw] leading-[.7] text-white/[.05] whitespace-nowrap">X-MAS</span>

        <div className="relative mt-14 flex flex-col-reverse items-center gap-3 border-t border-white/10 pt-6 text-[13px] text-white/50 sm:flex-row sm:justify-between">
          <span>{t("foot.rights")}</span>
          <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-1">
            <Link href="/privacy" className="hover:text-accent transition-colors">{t("foot.privacy")}</Link>
            <Link href="/terms" className="hover:text-accent transition-colors">{t("foot.terms")}</Link>
            <Link href="/refund-policy" className="hover:text-accent transition-colors">{t("foot.refund")}</Link>
            <span className="hidden sm:inline text-white/20">·</span>
            <span className="text-[11px] uppercase tracking-[.15em] text-accent">{t("foot.slogan")}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

function Social({ href, label, children }: { href: string; label: string; children: React.ReactNode }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" aria-label={label}
      className="grid h-9 w-9 place-items-center rounded-full border border-white/15 bg-white/5 text-white/70 hover:bg-accent hover:text-white hover:border-accent transition-colors">
      {children}
    </a>
  );
}

function FootCol({ title, links }: { title: string; links: [string, string][] }) {
  return (
    <div>
      <h5 className="mb-4 text-[11px] font-semibold uppercase tracking-[.2em] text-accent">{title}</h5>
      <ul className="space-y-2.5">
        {links.map(([h, l]) => (
          <li key={l}><Link href={h} className="text-sm text-white/70 hover:text-accent transition-colors">{l}</Link></li>
        ))}
      </ul>
    </div>
  );
}
