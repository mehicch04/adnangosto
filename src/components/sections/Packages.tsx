import Link from "next/link";
import { PackagesGrid } from "@/components/sections/PackagesGrid";
import { formatPrice, packages } from "@/content/packages";

export function Packages() {
  const cards = packages.map((p) => ({
    slug: p.slug,
    name: p.name,
    badge: p.badge,
    audience: p.audience,
    price: formatPrice(p.price),
    priceUnit: p.priceUnit,
    checkIn: p.checkIn,
    features: p.cardFeatures,
  }));

  return (
    <section
      id="saradnja"
      aria-labelledby="saradnja-naslov"
      className="scroll-mt-20 bg-brand-paper px-5 py-24 text-brand-black lg:py-32"
    >
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-6 lg:grid-cols-2 lg:items-end">
          <div>
            <p className="flex items-center gap-3 text-sm font-bold tracking-[0.2em] uppercase">
              <span className="h-0.5 w-8 bg-brand-yellow" />
              Paketi i cijene
            </p>
            <h2
              id="saradnja-naslov"
              className="mt-4 font-display text-6xl leading-[0.88] sm:text-7xl lg:text-[7.5rem]"
            >
              Izaberi kako
              <br />
              radimo
            </h2>
          </div>
          <p className="max-w-md text-lg text-brand-ink-muted lg:justify-self-end">
            Sistem treninga i prehrane koji se uklapa u tvoj posao i obaveze. Svaki paket ima svoj
            upitnik, pa odmah dobijem sve što trebam da krenemo.
          </p>
        </div>

        <PackagesGrid packages={cards} />

        <div className="mt-10 flex flex-col gap-4 border-t-2 border-brand-black pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="flex items-center gap-3 text-[15px] font-semibold">
            <span className="grid size-6 place-items-center rounded-full bg-brand-black text-brand-yellow">
              <svg viewBox="0 0 16 16" aria-hidden="true" className="size-3.5">
                <path
                  d="m3 8.5 3 3 7-7"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.25"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
            Prijava je besplatna i ne obavezuje te ni na šta.
          </p>
          <Link
            href="/cjenovnik"
            className="inline-flex min-h-11 items-center gap-2 text-[15px] font-semibold underline decoration-brand-yellow decoration-2 underline-offset-4 hover:decoration-brand-black"
          >
            Kompletan cjenovnik: konzultacije, lični trening, seminari
          </Link>
        </div>
      </div>
    </section>
  );
}
