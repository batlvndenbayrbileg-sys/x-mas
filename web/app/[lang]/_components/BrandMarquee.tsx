"use client";
import { InfiniteSlider } from "@/components/ui/infinite-slider";
import { ProgressiveBlur } from "@/components/ui/progressive-blur";

// The brands X-MAS actually carries (repeated so the infinite marquee stays dense).
const BRANDS = ["Converse", "New Balance", "UGG", "The North Face", "Converse", "New Balance", "UGG", "The North Face"];

export function BrandMarquee() {
  return (
    <div className="relative h-[92px] w-full overflow-hidden">
      <InfiniteSlider className="flex h-full w-full items-center" duration={32} gap={64}>
        {BRANDS.map((b, i) => (
          <div key={`${b}-${i}`} className="flex items-center justify-center px-2">
            <span className="font-display uppercase tracking-[.04em] text-[22px] sm:text-[26px] text-ink/25 whitespace-nowrap">{b}</span>
          </div>
        ))}
      </InfiniteSlider>
      <ProgressiveBlur className="pointer-events-none absolute top-0 left-0 h-full w-[140px]" direction="left" blurIntensity={1} />
      <ProgressiveBlur className="pointer-events-none absolute top-0 right-0 h-full w-[140px]" direction="right" blurIntensity={1} />
    </div>
  );
}
