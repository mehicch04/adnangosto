/*
  Jedno mjesto za izgled dugmadi, da svako dugme na sajtu izgleda isto.
  Renderuje <a> (Next Link), jer sva naša dugmad vode negdje, ne šalju formu.

  Pravilo kontrasta: na žutom je tekst CRN (10.3:1). Bijeli bi pao na 1.9:1.
*/
import Link from "next/link";

type Props = {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "ghost";
  className?: string;
};

export function Button({ href, children, variant = "primary", className = "" }: Props) {
  // min-h-12 = 48px, preporučena visina za prst na telefonu
  const base =
    "inline-flex min-h-12 items-center justify-center gap-2 rounded-md px-6 font-semibold transition-colors";

  const styles =
    variant === "primary"
      ? "bg-brand-yellow text-brand-black hover:bg-[#f5c24a]"
      : "border border-brand-line text-brand-white hover:border-brand-yellow hover:text-brand-yellow";

  return (
    <Link href={href} className={`${base} ${styles} ${className}`}>
      {children}
    </Link>
  );
}
