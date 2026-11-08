import Image from "next/image";
import Link from "next/link";
import { InstagramIcon } from "@/components/ui/icons";
import { site } from "@/content/site";
import { packages } from "@/content/packages";

const pages = [
  { label: "Početna", href: "/" },
  { label: "O meni", href: "/o-meni" },
  { label: "Cjenovnik", href: "/cjenovnik" },
  { label: "Rezultati", href: "/#rezultati" },
  { label: "Transformacije", href: "/#transformacije" },
  { label: "Česta pitanja", href: "/#pitanja" },
];

export function SiteFooter() {
  return (
    <footer className="relative isolate overflow-hidden border-t border-brand-line bg-brand-black">
      <svg
        aria-hidden="true"
        viewBox="0 0 1000 170"
        preserveAspectRatio="xMidYMax meet"
        className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 w-full select-none"
      >
        <text
          x="500"
          y="188"
          textAnchor="middle"
          fill="#161616"
          style={{ fontFamily: "var(--font-display)", fontSize: 232 }}
        >
          GOSTO ADNAN
        </text>
      </svg>
      <div className="mx-auto max-w-7xl px-5 pt-20 pb-[14vw] lg:pt-28 lg:pb-[12vw]">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr_1fr_1fr] lg:gap-10">
          <div>
            <Image
              src="/images/logo-ga.png"
              alt="Gosto Adnan"
              width={129}
              height={70}
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
              className="mt-8 inline-flex min-h-12 items-center gap-3 rounded-sm border border-white/15 px-5 font-semibold transition-colors hover:border-brand-yellow hover:text-brand-yellow"
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
              Paketi
            </h2>
            <ul className="mt-5 space-y-3">
              {packages.map((p) => (
                <li key={p.slug}>
                  <Link
                    href={`/paketi/${p.slug}`}
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
              Kontakt
            </h2>
            <ul className="mt-5 space-y-3 text-white/75">
              <li>
                <a
                  href={`mailto:${site.email}`}
                  className="[overflow-wrap:anywhere] transition-colors hover:text-white"
                >
                  {site.email}
                </a>
              </li>
              <li>Online coaching bez obzira na lokaciju</li>
              <li>Zagreb i Mostar</li>
            </ul>
            <Link
              href="/#saradnja"
              className="mt-8 inline-flex min-h-12 items-center rounded-sm bg-brand-yellow px-6 text-[13px] font-bold tracking-[0.14em] text-brand-black uppercase transition-colors hover:bg-white"
            >
              Prijavi se
            </Link>
          </div>
        </div>

        <div className="mt-20 flex flex-col gap-4 border-t border-brand-line py-6 text-sm text-brand-muted sm:flex-row sm:items-center sm:justify-between">
          <p className="flex flex-wrap gap-x-5 gap-y-2">
            <span>
              © {new Date().getFullYear()} {site.name}. Sva prava zadržana.
            </span>
            <Link href="/politika-privatnosti" className="transition-colors hover:text-white">
              Politika privatnosti
            </Link>
          </p>
          <a
            href="https://mehiccdev.com"
            target="_blank"
            rel="noopener"
            className="group inline-flex items-center gap-2 text-xs tracking-[0.14em] uppercase transition-colors hover:text-white"
          >
            Designed &amp; powered by
            <span className="inline-flex items-center gap-1.5 font-bold text-white">
              <span className="size-1.5 rounded-full bg-brand-yellow transition-transform duration-300 group-hover:scale-150" />
              mehiccdev
            </span>
          </a>
        </div>
      </div>
    </footer>
  );
}
