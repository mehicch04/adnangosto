/*
  Zaglavlje: logo, sidra do sekcija i dugme za prijavu.
  Lijepi se za vrh (sticky) da je prijava uvijek na dohvat palca.

  Na mobitelu sakrivamo meni i ostavljamo samo logo i dugme.
  Stranica je jedna i kratka za skrolanje, pa meni na telefonu ne treba,
  a ne treba ni JavaScript za hamburger. Manje koda, bolja ocjena.
*/
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

const nav = [
  { label: "Saradnja", href: "#saradnja" },
  { label: "Kako radimo", href: "#kako-radimo" },
  { label: "Rezultati", href: "#rezultati" },
  { label: "O meni", href: "#o-meni" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-brand-line/60 bg-brand-black/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-6 px-5">
        <Link href="/" aria-label="Adnan Gosto, početna" className="shrink-0">
          {/* priority: logo je vidljiv odmah, ne smije se učitavati lijeno */}
          <Image
            src="/images/logo-ga.png"
            alt="Gosto Adnan"
            width={560}
            height={304}
            priority
            className="h-9 w-auto"
          />
        </Link>

        <nav aria-label="Glavni meni" className="hidden md:block">
          <ul className="flex gap-8 text-sm">
            {nav.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  className="text-brand-muted transition-colors hover:text-brand-white"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <Button href="#saradnja" className="min-h-10 px-4 text-sm">
          Prijavi se
        </Button>
      </div>
    </header>
  );
}
