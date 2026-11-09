import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost" | "danger";
type Size = "sm" | "md";

const variants: Record<Variant, string> = {
  primary:
    "bg-brand-yellow text-brand-black hover:bg-[#f5c24a] shadow-[0_8px_24px_-12px_rgba(237,177,45,0.8)]",
  secondary:
    "border border-white/12 bg-white/[0.04] text-white hover:border-white/25 hover:bg-white/[0.08]",
  ghost: "text-white/70 hover:bg-white/[0.06] hover:text-white",
  danger: "border border-[#ff6b5a]/30 bg-[#ff6b5a]/10 text-[#ff9b8f] hover:bg-[#ff6b5a]/20",
};

const sizes: Record<Size, string> = {
  sm: "h-9 gap-1.5 rounded-lg px-3 text-[13px]",
  md: "h-11 gap-2 rounded-xl px-4 text-sm",
};

export function buttonClass(variant: Variant = "primary", size: Size = "md", extra = "") {
  return `inline-flex shrink-0 items-center justify-center font-semibold whitespace-nowrap transition-[background-color,border-color,color,box-shadow,transform] duration-200 outline-none select-none focus-visible:outline-none! focus-visible:ring-2 focus-visible:ring-brand-yellow/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0b0b0b] active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50 ${variants[variant]} ${sizes[size]} ${extra}`;
}

export function Button({
  variant = "primary",
  size = "md",
  loading = false,
  className = "",
  children,
  ...rest
}: ComponentProps<"button"> & { variant?: Variant; size?: Size; loading?: boolean }) {
  return (
    <button
      className={buttonClass(variant, size, className)}
      disabled={loading || rest.disabled}
      {...rest}
    >
      {loading && <Spinner />}
      {children}
    </button>
  );
}

export function ButtonLink({
  variant = "secondary",
  size = "md",
  className = "",
  ...rest
}: ComponentProps<typeof Link> & { variant?: Variant; size?: Size }) {
  return <Link className={buttonClass(variant, size, className)} {...rest} />;
}

export function Spinner({ className = "size-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={`animate-spin ${className}`}>
      <circle
        cx="12"
        cy="12"
        r="9"
        fill="none"
        stroke="currentColor"
        strokeOpacity="0.25"
        strokeWidth="3"
      />
      <path
        d="M21 12a9 9 0 0 0-9-9"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
}

export const inputClass =
  "block h-11 w-full rounded-xl border border-white/10 bg-black/40 px-3.5 text-[15px] text-white placeholder:text-white/30 outline-none focus-visible:outline-none! transition-[border-color,box-shadow,background-color] hover:border-white/20 focus:border-brand-yellow/70 focus:bg-black/60 focus:ring-4 focus:ring-brand-yellow/15 aria-[invalid=true]:border-[#ff6b5a]/70";

export function Field({
  label,
  hint,
  error,
  htmlFor,
  children,
}: {
  label: string;
  hint?: string;
  error?: string | null;
  htmlFor: string;
  children: ReactNode;
}) {
  return (
    <div>
      <label htmlFor={htmlFor} className="mb-1.5 block text-[13px] font-semibold text-white/80">
        {label}
      </label>
      {children}
      {error ? (
        <p className="mt-1.5 text-[13px] font-medium text-[#ff9b8f]">{error}</p>
      ) : hint ? (
        <p className="mt-1.5 text-[13px] text-white/45">{hint}</p>
      ) : null}
    </div>
  );
}

export function Card({ className = "", children }: { className?: string; children: ReactNode }) {
  return (
    <section
      className={`rounded-2xl border border-white/[0.08] bg-white/[0.025] shadow-[0_1px_0_rgba(255,255,255,0.04)_inset] ${className}`}
    >
      {children}
    </section>
  );
}

export function CardHeader({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-white/[0.06] px-5 py-4 sm:px-6">
      <div>
        <h2 className="text-[15px] font-semibold text-white">{title}</h2>
        {description && <p className="mt-0.5 text-[13px] text-white/50">{description}</p>}
      </div>
      {action}
    </div>
  );
}

export function PageHeader({
  title,
  description,
  actions,
}: {
  title: string;
  description?: ReactNode;
  actions?: ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div className="min-w-0">
        <h1 className="font-display text-5xl leading-none tracking-wide sm:text-6xl">{title}</h1>
        {description && <p className="mt-2 text-[15px] text-white/55">{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </div>
  );
}

export function Badge({ className = "", children }: { className?: string; children: ReactNode }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold ${className}`}
    >
      {children}
    </span>
  );
}

export function EmptyState({
  icon,
  title,
  text,
  action,
}: {
  icon: ReactNode;
  title: string;
  text: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center rounded-2xl border border-dashed border-white/12 px-6 py-16 text-center">
      <span className="grid size-12 place-items-center rounded-2xl bg-white/[0.05] text-white/60">
        {icon}
      </span>
      <p className="mt-4 font-semibold text-white">{title}</p>
      <p className="mt-1 max-w-sm text-sm text-white/50">{text}</p>
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}

export function Skeleton({ className = "" }: { className?: string }) {
  return <span className={`block animate-pulse rounded-lg bg-white/[0.06] ${className}`} />;
}
