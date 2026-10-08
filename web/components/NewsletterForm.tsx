"use client";
import { useState } from "react";
import { useToast } from "@/lib/store";
import { useT } from "@/components/LangProvider";

/** White capsule with the CTA tucked inside — sits on the dark footer card. */
export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const showToast = useToast(s => s.show);
  const t = useT();
  return (
    <form
      onSubmit={(e) => { e.preventDefault(); showToast(t("news.subscribed")); setEmail(""); }}
      className="relative z-10 mx-auto w-full max-w-[440px]"
    >
      <div className="flex items-center gap-2 rounded-pill bg-white p-1.5 pl-5 shadow-[0_18px_40px_-16px_rgba(0,0,0,.55)] transition-shadow focus-within:shadow-[0_18px_44px_-14px_rgba(241,89,43,.5)]">
        <input
          type="email" required value={email} onChange={e => setEmail(e.target.value)}
          placeholder={t("news.placeholder")}
          aria-label={t("news.placeholder")}
          className="min-w-0 flex-1 bg-transparent py-2.5 text-[14px] text-ink outline-none placeholder:text-subtle"
        />
        <button
          type="submit"
          className="h-10 shrink-0 rounded-pill bg-accent px-5 text-[13.5px] font-semibold text-white transition-all duration-300 ease-spring hover:bg-accent-deep hover:scale-[1.03] active:scale-95"
        >
          {t("news.alerts")}
        </button>
      </div>
    </form>
  );
}
