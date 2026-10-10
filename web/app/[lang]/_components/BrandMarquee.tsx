"use client";
import { LocaleLink as Link } from "@/components/LocaleLink";
import { InfiniteSlider } from "@/components/ui/infinite-slider";
import { ProgressiveBlur } from "@/components/ui/progressive-blur";

// The brands X-MAS actually carries. Logos live in /public/brands as SVG; they
// are greyscaled in the rail and regain their colour on hover. Repeated so the
// loop always fills a wide row.
const BRANDS = [
  { name: "Converse", href: "/shop?category=Converse", logo: "/brands/converse.svg" },
  { name: "Nike", href: "/shop?category=Nike", logo: "/brands/nike.svg" },
  { name: "New Balance", href: "/shop?category=New%20Balance", logo: "/brands/new-balance.svg" },
  { name: "ASICS", href: "/shop?category=ASICS", logo: "/brands/asics.svg" },
  { name: "Salomon", href: "/shop?category=Salomon", logo: "/brands/salomon.svg" },
  { name: "UGG", href: "/shop?category=UGG", logo: "/brands/ugg.svg" },
  { name: "The North Face", href: "/shop?category=The%20North%20Face", logo: "/brands/the-north-face.svg" },
];
const ROW = [...BRANDS, ...BRANDS, ...BRANDS];

export function BrandMarquee() {
  return (
    <div className="relative h-[108px] w-full overflow-hidden">
      <InfiniteSlider className="flex h-full w-full items-center" duration={38} durationOnHover={110} gap={20}>
        {ROW.map((b, i) => (
          <Link
            key={`${b.name}-${i}`}
            href={b.href}
            aria-label={b.name}
            className="group grid h-[84px] min-w-[215px] place-items-center rounded-2xl bg-mist px-5 transition-colors hover:bg-surface-3"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={b.logo}
              alt={b.name}
              draggable={false}
              className="h-11 w-auto max-w-[165px] select-none object-contain opacity-50 grayscale transition duration-300 group-hover:opacity-100 group-hover:grayscale-0"
            />
          </Link>
        ))}
      </InfiniteSlider>
      <ProgressiveBlur className="pointer-events-none absolute left-0 top-0 h-full w-[120px]" direction="left" blurIntensity={1} />
      <ProgressiveBlur className="pointer-events-none absolute right-0 top-0 h-full w-[120px]" direction="right" blurIntensity={1} />
    </div>
  );
}
