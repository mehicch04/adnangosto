import Link from "next/link";
import { getPackages } from "@/lib/content";

export async function Packages() {
  const packages = await getPackages();

  return (
    <section
      id="saradnja"
      className="scroll-mt-24 bg-brand-paper px-5 py-24 text-brand-black lg:py-32"
    >
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-6 lg:grid-cols-2 lg:items-end">
          <h2 className="font-display text-6xl leading-[0.88] sm:text-7xl lg:text-[7.5rem]">
            Izaberi kako
            <br />
            radimo
          </h2>
          <p className="max-w-md text-lg text-brand-ink-muted lg:justify-self-end">
            Svaki paket ima svoju prijavu. Odgovoriš na pitanja bitna baš za tvoj cilj, a ja dobijem
            sve što trebam da ti se javim s konkretnim prijedlogom.
          </p>
        </div>

        <ul className="mt-16 border-t-2 border-brand-black">
          {packages.map((pkg) => (
            <li key={pkg.slug} className="group relative border-b border-brand-paper-line">
              <span
                aria-hidden="true"
                className="absolute inset-y-0 left-0 w-0 bg-brand-yellow transition-all duration-500 group-hover:w-1.5"
              />
              <div className="grid gap-6 py-10 transition-[padding] duration-500 lg:grid-cols-[1.1fr_1.2fr_auto] lg:items-center lg:gap-12 lg:py-12 group-hover:lg:pl-8">
                <div>
                  {pkg.duration && (
                    <p className="text-sm font-semibold tracking-[0.15em] text-brand-ink-muted uppercase">
                      {pkg.duration}
                    </p>
                  )}
                  <h3 className="mt-2 font-display text-5xl leading-none lg:text-6xl">
                    {pkg.name}
                  </h3>
                  {pkg.audience && <p className="mt-3 font-semibold">{pkg.audience}</p>}
                </div>
                <div>
                  {pkg.tagline && <p className="text-brand-ink-muted">{pkg.tagline}</p>}
                  <ul className="mt-4 flex flex-wrap gap-2">
                    {pkg.features.map((f) => (
                      <li
                        key={f}
                        className="rounded-full border border-brand-black/15 bg-white px-3.5 py-1.5 text-sm font-semibold"
                      >
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="flex items-center gap-6 lg:flex-col lg:items-end lg:gap-2">
                  <Link
                    href={`/prijava/${pkg.slug}`}
                    className="inline-flex min-h-14 items-center rounded-md bg-brand-black px-8 text-lg font-semibold text-white transition-colors group-hover:bg-brand-yellow group-hover:text-brand-black"
                  >
                    Prijavi se
                    <span className="sr-only"> za {pkg.name}</span>
                  </Link>
                  {pkg.price_label && (
                    <p className="text-sm text-brand-ink-muted">Cijena {pkg.price_label}</p>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
