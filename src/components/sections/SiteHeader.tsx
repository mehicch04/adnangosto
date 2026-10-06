import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

const nav = [
  { label: "Saradnja", href: "/#saradnja" },
  { label: "Rezultati", href: "/#rezultati" },
  { label: "O meni", href: "/o-meni" },
  { label: "Kako radimo", href: "/#kako-radimo" },
];

export function SiteHeader() {
  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b border-white/10 bg-brand-black/70 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-6 px-5 lg:h-20">
        <Link href="/" aria-label="Adnan Gosto, početna" className="shrink-0">
          <Image
            src="/images/logo-ga.png"
            alt="Gosto Adnan"
            width={560}
            height={304}
            priority
            className="h-9 w-auto lg:h-11"
          />
        </Link>
        <nav aria-label="Glavni meni" className="hidden md:block">
          <ul className="flex gap-9 text-sm font-semibold tracking-wide">
            {nav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="text-white/70 transition-colors hover:text-brand-yellow"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <Button href="/#saradnja" className="min-h-10 px-5 text-sm">
          Prijavi se
        </Button>
      </div>
    </header>
  );
}
