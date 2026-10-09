"use client";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

// Product images fade + settle in as they decode, instead of popping. The single
// inline transition covers BOTH opacity and transform, so a card's hover-zoom
// (driven by a group-hover scale class) still animates at 700ms; priority/LCP
// images skip the fade so they never delay perceived load.

/**
 * Photographic image via next/image (responsive srcset + AVIF/WebP + lazy) with
 * a graceful fallback. Uses `fill`, so the PARENT must be positioned
 * (relative/absolute) and sized. If the image fails, we render the fallback so
 * the UI never shows a broken image.
 */
export function Photo({
  src, alt, fallback, imgClassName, className, sizes, priority,
}: {
  src?: string;
  alt: string;
  className?: string;
  imgClassName?: string;
  fallback?: React.ReactNode;
  sizes?: string;
  priority?: boolean;
}) {
  const [failed, setFailed] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const imgRef = useRef<HTMLImageElement | null>(null);
  // React's synthetic onLoad does not reliably fire for every <Image> (already
  // decoded, or attached after the load event), which used to leave the image
  // stuck at opacity 0. Listen natively as well, and keep a timeout as a last
  // resort so a product shot is never left invisible.
  useEffect(() => {
    const el = imgRef.current;
    if (!el) return;
    if (el.complete) { setLoaded(true); return; }
    const show = () => setLoaded(true);
    el.addEventListener("load", show);
    const id = window.setTimeout(show, 1500);
    return () => { el.removeEventListener("load", show); window.clearTimeout(id); };
  }, [src]);
  if (!src || failed) return <>{fallback}</>;
  // Fade in on decode, but NEVER stay hidden: cached images can skip onLoad, so
  // a ref callback marks already-complete images visible immediately.
  return (
    <Image
      ref={imgRef}
      src={src}
      alt={alt}
      fill
      sizes={sizes ?? "(max-width: 768px) 100vw, 50vw"}
      priority={priority}
      onError={() => setFailed(true)}
      onLoad={() => setLoaded(true)}
      className={imgClassName ?? className}
      style={priority ? undefined : {
        opacity: loaded ? 1 : 0,
        transition: "opacity .5s ease",
      }}
    />
  );
}
