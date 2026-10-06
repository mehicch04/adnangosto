import Image from "next/image";
import Link from "next/link";
import { InstagramIcon } from "@/components/ui/icons";
import { site } from "@/content/site";
import { getPackages } from "@/lib/content";

const pages = [
  { label: "Početna", href: "/" },
  { label: "O meni", href: "/o-meni" },
  { label: "Rezultati", href: "/#rezultati" },
  { label: "Kako radimo", href: "/#kako-radimo" },
];

export async function SiteFooter() {
  const packages = await getPackages();

  return (
    <footer className="relative isolate overflow-hidden border-t border-brand-line bg-brand-black">
      <p
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-[-2vw] -z-10 text-center font-display text-[22vw] leading-[0.8] whitespace-nowrap text-[#161616] select-none"
      >
        Gosto Adnan
      </p>
      <div className="mx-auto max-w-7xl px-5 pt-20 pb-[14vw] lg:pt-28 lg:pb-[12vw]">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr_1fr_1fr] lg:gap-10">
          <div>
            <Image
              src="/images/logo-ga.png"
              alt="Gosto Adnan"
              width={560}
              height={304}
              className="h-14 w-auto"
            />
            <p className="mt-6 max-w-xs text-brand-muted">
              IFBB Pro i trener takmičara. Coaching, priprema za takmičenja i edukacija za trenere,
              uživo i online.
            </p>
            <a
              href={site.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 inline-flex min-h-12 items-center gap-3 rounded-full border border-white/15 px-5 font-semibold transition-colors hover:border-brand-yellow hover:text-brand-yellow"
            >
              <InstagramIcon />
              {site.instagramHandle}
            </a>
          </div>

          <nav aria-label="Stranice">
            <h2 className="font-display text-3xl leading-none tracking-wide text-brand-yellow">
              Stranice
            </h2>
            <ul className="mt-5 space-y-3">
              {pages.map((p) => (
                <li key={p.href}>
                  <Link href={p.href} className="text-white/75 transition-colors hover:text-white">
                    {p.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Saradnja">
            <h2 className="font-display text-3xl leading-none tracking-wide text-brand-yellow">
              Saradnja
            </h2>
            <ul className="mt-5 space-y-3">
              {packages.map((p) => (
                <li key={p.slug}>
                  <Link
                    href={`/prijava/${p.slug}`}
                    className="text-white/75 transition-colors hover:text-white"
                  >
                    {p.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h2 className="font-display text-3xl leading-none tracking-wide text-brand-yellow">
              Rad
            </h2>
            <ul className="mt-5 space-y-3 text-white/75">
              <li>Zagreb i Mostar</li>
              <li>Online coaching bez obzira na lokaciju</li>
              <li>Priprema takmičara kroz cijelu sezonu</li>
            </ul>
            <Link
              href="/#saradnja"
              className="mt-8 inline-flex min-h-12 items-center rounded-full bg-brand-yellow px-7 pt-0.5 font-display text-2xl leading-none tracking-wide text-brand-black transition-colors hover:bg-white"
            >
              Prijavi se
            </Link>
          </div>
        </div>

        <div className="mt-20 flex flex-col gap-4 border-t border-brand-line py-6 text-sm text-brand-muted sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {site.name}. Sva prava zadržana.
          </p>
          <a
            href="#"
            className="inline-flex items-center gap-2 transition-colors hover:text-brand-yellow"
          >
            Nazad na vrh
            <svg viewBox="0 0 24 24" aria-hidden="true" className="size-4" fill="none">
              <path
                d="M12 19V5m0 0-6 6m6-6 6 6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </a>
        </div>
      </div>
    </footer>
  );
}
