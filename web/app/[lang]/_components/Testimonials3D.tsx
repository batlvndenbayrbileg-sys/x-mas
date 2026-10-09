"use client";
import { Marquee } from "@/components/ui/3d-testimonials";
import { LocaleLink as Link } from "@/components/LocaleLink";
import { Stars } from "@/components/Stars";
import { useT } from "@/components/LangProvider";
import type { Review } from "@/lib/types";

/** Initials, not a stock photo — the person who wrote this is a real customer. */
function Avatar({ name }: { name: string }) {
  const initials = name.trim().split(/\s+/).slice(0, 2).map(w => w[0]?.toUpperCase() ?? "").join("");
  return (
    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-accent-soft text-[12px] font-bold text-accent-deep">
      {initials || "?"}
    </span>
  );
}

function Card({ review }: { review: Review }) {
  const t = useT();
  const card = (
    <figure className="w-56 rounded-2xl border border-line bg-frost-deep p-4 shadow-soft transition-shadow hover:shadow-deep">
      <div className="flex items-center gap-2.5">
        <Avatar name={review.name} />
        <div className="flex min-w-0 flex-col">
          <figcaption className="truncate text-sm font-semibold text-ink">{review.name}</figcaption>
          <Stars rating={review.rating} size={11} />
        </div>
      </div>
      {review.title && <h3 className="mt-3 text-[13px] font-semibold text-ink">{review.title}</h3>}
      <blockquote className={`line-clamp-5 text-[13px] leading-relaxed text-ink/75 ${review.title ? "mt-1" : "mt-3"}`}>
        {review.body}
      </blockquote>
      {review.verified && (
        <p className="mt-2.5 text-[10.5px] font-semibold uppercase tracking-[.08em] text-accent-deep">{t("rev.verified")}</p>
      )}
    </figure>
  );
  // The feed carries the product's handle, so a card doubles as a way in.
  return review.product_handle
    ? <Link href={`/product/${review.product_handle}`}>{card}</Link>
    : card;
}

/**
 * Wall of real, approved customer reviews. The caller only mounts this when
 * there are reviews to show, so the homepage never carries invented praise.
 * Column count scales with how many reviews exist — four thin columns of the
 * same two reviews would read as padding.
 */
export function Testimonials3D({ reviews }: { reviews: Review[] }) {
  if (!reviews.length) return null;

  const columns = Math.min(4, Math.max(1, Math.ceil(reviews.length / 3)));
  // Offset each column's starting point so the same card isn't level across the wall.
  const lanes = Array.from({ length: columns }, (_, i) => {
    const offset = Math.floor((reviews.length / columns) * i);
    return [...reviews.slice(offset), ...reviews.slice(0, offset)];
  });
  // Durations go through the CSS variable rather than an arbitrary class:
  // Tailwind only compiles class names it can see as literals in the source.
  const speeds = ["38s", "44s", "40s", "46s"];
  const visibility = ["", "", "hidden sm:flex", "hidden lg:flex"];

  return (
    <div className="relative flex h-[420px] w-full flex-row items-center justify-center gap-2 overflow-hidden [perspective:320px]">
      <div
        className="flex flex-row items-center gap-4"
        style={{ transform: "translateX(-40px) translateZ(-90px) rotateX(18deg) rotateY(-8deg) rotateZ(18deg)" }}
      >
        {lanes.map((lane, i) => (
          <Marquee
            key={i}
            vertical
            pauseOnHover
            reverse={i % 2 === 1}
            repeat={3}
            style={{ ["--duration" as string]: speeds[i] } as React.CSSProperties}
            className={visibility[i]}
          >
            {lane.map(r => <Card key={r.id} review={r} />)}
          </Marquee>
        ))}
      </div>
      <div className="pointer-events-none absolute inset-x-0 top-0 h-1/4 bg-gradient-to-b from-frost to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-frost to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 left-0 w-1/5 bg-gradient-to-r from-frost to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-1/5 bg-gradient-to-l from-frost to-transparent" />
    </div>
  );
}
