"use client";
import { LocaleLink as Link } from "@/components/LocaleLink";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth, useToast } from "@/lib/store";
import { useT, useLang } from "@/components/LangProvider";
import { api } from "@/lib/api";
import { EyeIcon, EyeOffIcon, ChevronLeft } from "@/components/Icons";
import { Photo } from "@/components/Photo";

function pwScore(pw: string): 0 | 1 | 2 | 3 {
  if (!pw) return 0;
  let s = 0;
  if (pw.length >= 8) s++;
  if (pw.length >= 12 || (/\d/.test(pw) && /[^A-Za-z0-9]/.test(pw))) s++;
  if (/[A-Z]/.test(pw) && /[a-z]/.test(pw) && /\d/.test(pw)) s++;
  return Math.min(3, s) as 0 | 1 | 2 | 3;
}

const MailCheckIcon = ({ width = 24, height = 24 }: { width?: number; height?: number }) => (
  <svg width={width} height={height} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M21 10.5V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h8" />
    <path d="m3.5 7.5 8.5 6 8.5-6" />
    <path d="m16 17 2 2 4-4" />
  </svg>
);

const TickIcon = ({ width = 16, height = 16 }: { width?: number; height?: number }) => (
  <svg width={width} height={height} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="m4 12.5 5.2 5.2L20 7" />
  </svg>
);

// The shot that carries the panel — a cutout, so it sits on the ink field with
// no box around it.
const PANEL_SHOE = "/products/converse-chuck70-hi-black.png";

export default function AuthPage() {
  const router = useRouter();
  const t = useT();
  const lang = useLang();
  const setSession = useAuth(s => s.setSession);
  const showToast = useToast(s => s.show);
  const [mode, setMode] = useState<"login" | "register" | "forgot">("login");
  const [busy, setBusy] = useState(false);
  const [showPw, setShowPw] = useState(false);
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState("");
  const isReg = mode === "register";
  const isForgot = mode === "forgot";

  const update = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(f => ({ ...f, [k]: e.target.value }));
    setErrors(er => ({ ...er, [k]: "" }));
  };

  function validate() {
    const er: Record<string, string> = {};
    if (isReg && !form.name.trim()) er.name = t("common.required");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) er.email = t("auth.invalidEmail");
    if (!isForgot && form.password.length < (isReg ? 8 : 1)) er.password = isReg ? t("auth.min8") : t("common.required");
    setErrors(er);
    return Object.keys(er).length === 0;
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setFormError("");
    setBusy(true);
    try {
      if (isForgot) {
        // Always resolves (no info leak); show the confirmation regardless.
        await api.auth.resetRequest(form.email);
        setSent(true);
        setBusy(false);
        return;
      }
      let result;
      if (isReg) {
        const parts = form.name.trim().split(/\s+/);
        const firstName = parts[0];
        const lastName = parts.slice(1).join(" ") || firstName;
        result = await api.auth.signup({ firstName, lastName, email: form.email, password: form.password });
      } else {
        result = await api.auth.login(form.email, form.password);
      }
      setSession(result.user, result.token);
      showToast(`${t("auth.welcomeName")}, ${result.user.firstName}!`);
      router.push(`/${lang}/account`);
    } catch (err: any) {
      const msg = err.message || t("toast.authFailed");
      showToast(msg);
      setFormError(msg);
      setBusy(false);
    }
  }

  const goForgot = () => { setMode("forgot"); setSent(false); setErrors({}); setFormError(""); };
  const backToLogin = () => { setMode("login"); setSent(false); setErrors({}); setFormError(""); };

  const score = pwScore(form.password);
  const strengthLabel = [t("auth.pwWeak"), t("auth.pwWeak"), t("auth.pwFair"), t("auth.pwStrong")][score];
  const strengthColor = ["#9aa0a6", "#ef4444", "#f59e0b", "#16a34a"][score];

  const toggle = () => { setMode(isReg ? "login" : "register"); setErrors({}); setFormError(""); };

  return (
    <div className="grid min-h-screen place-items-center bg-white px-4 py-8 sm:py-12">
      <div className="relative w-full max-w-[1020px] overflow-hidden rounded-[1.75rem] border border-line bg-white shadow-[0_40px_90px_-34px_rgba(22,21,21,.38)] sm:rounded-[2.25rem] lg:grid lg:min-h-[620px] lg:grid-cols-[1.05fr_1fr]">

        {/* ============ PANEL (desktop) ============ */}
        <div className="relative hidden flex-col justify-between overflow-hidden bg-ink px-12 py-12 text-white lg:flex">
          {/* accent bloom + oversized wordmark, as on the dark homepage band */}
          <div aria-hidden className="pointer-events-none absolute -left-24 -top-24 h-[380px] w-[380px] rounded-full bg-accent/25 blur-[90px]" />
          <span aria-hidden className="pointer-events-none absolute -bottom-6 -left-4 select-none font-display text-[150px] uppercase leading-none tracking-[.02em] text-white/[.045]">X-MAS</span>

          <div className="relative z-10">
            <Link href="/" aria-label="X-MAS" className="inline-block">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/logo.png" alt="X-MAS" className="h-14 w-auto object-contain brightness-0 invert transition-opacity hover:opacity-80" />
            </Link>
            <p className="mt-5 text-[11px] font-semibold uppercase tracking-[.2em] text-white/45">{t("auth.brandTag")}</p>
            <h2 className="h-strike-2 mt-3 max-w-[9ch] text-white">{isReg ? t("auth.backPromo") : t("auth.newHere")}</h2>
            <p className="mt-4 max-w-[330px] text-[14px] leading-relaxed text-white/60">{isReg ? t("auth.backPromoDesc") : t("auth.newHereDesc")}</p>

            <ul className="mt-7 space-y-3">
              {[t("auth.perk1"), t("auth.perk2"), t("auth.perk3")].map(perk => (
                <li key={perk} className="flex items-center gap-3 text-[13.5px] text-white/85">
                  <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-accent text-white">
                    <TickIcon width={13} height={13} />
                  </span>
                  {perk}
                </li>
              ))}
            </ul>
          </div>

          <div className="relative z-10 flex items-end justify-between gap-4">
            <button type="button" onClick={toggle}
              className="h-12 shrink-0 rounded-pill border-2 border-white/70 px-8 text-[13px] font-semibold uppercase tracking-[.12em] transition-all duration-300 ease-spring hover:-translate-y-0.5 hover:bg-white hover:text-ink">
              {isReg ? t("auth.signIn") : t("auth.signUp")}
            </button>
            <div aria-hidden className="relative -mb-6 -mr-6 h-[150px] w-[230px] shrink-0">
              <Photo src={PANEL_SHOE} alt="" sizes="230px"
                imgClassName="object-contain drop-shadow-[0_26px_30px_rgba(0,0,0,.5)]" />
            </div>
          </div>
        </div>

        {/* ============ FORM ============ */}
        <div className="relative flex flex-col justify-center px-6 py-9 sm:px-10 lg:px-12 lg:py-12">
          {/* Mobile top: back · mark · switch */}
          <div className="mb-7 flex items-center justify-between lg:hidden">
            <Link href="/" aria-label={t("bc.home")} className="-ml-1 grid h-10 w-10 place-items-center rounded-full text-ink/70 transition hover:bg-surface-2">
              <ChevronLeft width={20} height={20} />
            </Link>
            <Link href="/" aria-label="X-MAS">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/logo.png" alt="X-MAS" className="h-10 w-auto object-contain" />
            </Link>
            <button type="button" onClick={toggle} className="-mr-2 px-2 py-2.5 text-[13px] font-semibold text-accent transition-colors hover:text-accent-deep">
              {isReg ? t("auth.signIn") : t("auth.signUp")}
            </button>
          </div>

          <h1 className="h-strike-3 text-ink">{isForgot ? t("auth.forgotTitle") : isReg ? t("auth.signUp") : t("auth.signIn")}</h1>
          <p className="mt-2 text-[14px] text-muted">{isForgot ? t("auth.forgotDesc") : isReg ? t("auth.freeForever") : t("auth.enterDetails")}</p>

          {isForgot && sent ? (
            <div className="mt-8 flex flex-col items-start text-left">
              <span className="grid h-12 w-12 place-items-center rounded-full bg-accent-soft text-accent">
                <MailCheckIcon width={24} height={24} />
              </span>
              <h2 className="mt-4 font-display text-[20px] tracking-tight">{t("auth.resetSentTitle")}</h2>
              <p className="mt-2 text-[14px] leading-relaxed text-muted max-w-[340px]">{t("auth.resetSentDesc")}</p>
              <p className="mt-3 text-[13px] font-medium text-ink break-all">{form.email}</p>
              <button type="button" onClick={backToLogin}
                className="mt-7 inline-flex items-center gap-1.5 text-[13px] font-semibold text-accent hover:underline">
                <ChevronLeft width={16} height={16} /> {t("auth.backToSignIn")}
              </button>
            </div>
          ) : (
          <form onSubmit={submit} noValidate className="mt-7 space-y-3.5">
            <FloatingField label={t("co.email")} name="email" type="email" inputMode="email" autoComplete="email"
              value={form.email} onChange={update("email")} error={errors.email}/>

            {isReg && (
              <FloatingField label={t("auth.yourName")} name="name" autoComplete="name"
                value={form.name} onChange={update("name")} error={errors.name}/>
            )}

            {!isForgot && (
            <FloatingField
              label={t("auth.password")} name="password" type={showPw ? "text" : "password"}
              autoComplete={isReg ? "new-password" : "current-password"}
              value={form.password} onChange={update("password")} error={errors.password}
              labelRight={isReg && form.password ? (
                <span className="flex items-center gap-2">
                  <span className="flex gap-1" aria-hidden>
                    {[1, 2, 3].map(i => <span key={i} className="h-[3px] w-4 rounded-full" style={{ background: i <= score ? strengthColor : "#E3E3E6" }}/>)}
                  </span>
                  <span className="text-[11px] font-semibold" style={{ color: strengthColor }}>{strengthLabel}</span>
                </span>
              ) : undefined}
              right={
                <button type="button" onClick={() => setShowPw(v => !v)} aria-label={showPw ? t("auth.hidePw") : t("auth.showPw")}
                  className="grid place-items-center w-9 h-9 -mr-1 rounded-full text-subtle hover:text-ink transition-colors">
                  {showPw ? <EyeOffIcon width={18} height={18}/> : <EyeIcon width={18} height={18}/>}
                </button>
              }
            />
            )}

            {!isReg && !isForgot && (
              <div className="text-right -mt-1">
                <button type="button" onClick={goForgot}
                  className="-mr-1 px-1 py-2 text-[12.5px] text-muted transition-colors hover:text-accent">{t("auth.forgot")}</button>
              </div>
            )}

            {formError && (
              <div role="alert" className="flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-[13px] text-red-700">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" className="mt-0.5 shrink-0" aria-hidden><circle cx="12" cy="12" r="9"/><path d="M12 8v5M12 16h.01"/></svg>
                <span>{formError}</span>
              </div>
            )}
            <button disabled={busy} type="submit"
              className="grid h-[52px] w-full place-items-center rounded-pill bg-accent text-[13px] font-semibold uppercase tracking-[.12em] text-white shadow-[0_14px_32px_-12px_rgba(241,89,43,.7)] transition-all duration-300 ease-spring hover:bg-accent-deep hover:-translate-y-0.5 active:scale-[.99] disabled:translate-y-0 disabled:opacity-60">
              {busy ? t("common.pleaseWait") : isForgot ? t("auth.sendResetLink") : isReg ? t("auth.signUp") : t("auth.signIn")}
            </button>

            {isForgot && (
              <div className="pt-2 text-center">
                <button type="button" onClick={backToLogin}
                  className="inline-flex items-center gap-1.5 text-[13px] font-medium text-muted hover:text-accent transition-colors">
                  <ChevronLeft width={16} height={16} /> {t("auth.backToSignIn")}
                </button>
              </div>
            )}
          </form>
          )}
        </div>
      </div>
    </div>
  );
}

function FloatingField({ label, error, right, labelRight, name, ...props }: {
  label: string; error?: string; right?: React.ReactNode; labelRight?: React.ReactNode;
} & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div>
      <div className={`rounded-2xl border bg-surface-2 px-4 py-2 transition focus-within:border-accent focus-within:bg-white focus-within:ring-4 focus-within:ring-accent/10 ${error ? "border-red-400" : "border-line"}`}>
        <div className="flex items-center justify-between">
          <label htmlFor={name} className="block text-[11px] font-medium text-subtle">{label}</label>
          {labelRight}
        </div>
        <div className="flex items-center">
          <input id={name} name={name} {...props}
            aria-invalid={!!error} aria-describedby={error ? `${name}-err` : undefined}
            className="flex-1 min-w-0 bg-transparent outline-none focus-visible:outline-none border-0 p-0 text-[15px] text-ink placeholder:text-subtle"/>
          {right}
        </div>
      </div>
      {error && <span id={`${name}-err`} role="alert" className="text-[11px] text-red-500 mt-1 block px-1">{error}</span>}
    </div>
  );
}
