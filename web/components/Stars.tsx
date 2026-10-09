/**
 * Five-star meter driven by a real mean rating. Renders the filled stars as a
 * clipped overlay so half-stars read correctly, and carries the numeric value
 * in its label for screen readers.
 */
export function Stars({ rating, size = 15 }: { rating: number; size?: number }) {
  const pct = Math.max(0, Math.min(100, (rating / 5) * 100));
  return (
    <span
      className="relative inline-block select-none leading-none"
      style={{ fontSize: size, letterSpacing: "1px" }}
      role="img"
      aria-label={`${rating} / 5`}
    >
      <span className="text-ink/15" aria-hidden>★★★★★</span>
      <span
        className="absolute inset-0 overflow-hidden whitespace-nowrap text-[#F4B400]"
        style={{ width: `${pct}%` }}
        aria-hidden
      >★★★★★</span>
    </span>
  );
}
