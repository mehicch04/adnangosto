/*
  SARADNJA: izbor puta (J3U "Choose your path") spojen s paketima.
  Svaka kartica kaže ZA KOGA je, ŠTA dobiješ i vodi na svoj upitnik.

  Ovo je async Server Component: podatke čeka na serveru,
  a u preglednik stiže gotov HTML bez ijedne linije JavaScripta.
*/
import Link from "next/link";
import { CheckIcon } from "@/components/ui/icons";
import { getPackages } from "@/lib/content";

export async function Packages() {
  const packages = await getPackages();

  return (
    <section id="saradnja" className="scroll-mt-20 px-5 py-20 lg:py-28">
      <div className="mx-auto max-w-6xl">
        <div className="max-w-2xl">
          <h2 className="font-display text-5xl leading-none sm:text-6xl">Izaberi kako radimo</h2>
          <p className="mt-4 text-lg text-brand-muted">
            Svaki paket ima svoju prijavu. Odgovoriš na pitanja koja su bitna baš za tvoj cilj, a ja
            dobijem sve što trebam da ti se javim s konkretnim prijedlogom.
          </p>
        </div>

        <ul className="mt-12 grid gap-5 md:grid-cols-3">
          {packages.map((pkg) => (
            <li
              key={pkg.slug}
              className="flex flex-col rounded-xl border border-brand-line bg-brand-surface p-6 transition-colors hover:border-brand-yellow/60"
            >
              {/* trajanje kao mala oznaka iznad naziva */}
              {pkg.duration && <p className="text-sm text-brand-muted">{pkg.duration}</p>}

              <h3 className="mt-1 font-display text-4xl leading-none">{pkg.name}</h3>

              {pkg.audience && (
                <p className="mt-4 text-sm font-semibold text-brand-yellow">{pkg.audience}</p>
              )}
              {pkg.tagline && <p className="mt-2 text-brand-muted">{pkg.tagline}</p>}

              <ul className="mt-6 space-y-3">
                {pkg.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <CheckIcon className="mt-0.5 size-5 shrink-0 text-brand-yellow" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              {/* mt-auto gura dugme na dno, pa su sva tri dugmeta u istoj liniji */}
              <div className="mt-auto pt-8">
                <Link
                  href={`/prijava/${pkg.slug}`}
                  className="flex min-h-12 items-center justify-center rounded-md bg-brand-yellow font-semibold text-brand-black transition-colors hover:bg-[#f5c24a]"
                >
                  Prijavi se
                  {/* skriveni tekst: čitač ekrana čuje "Prijavi se za Klasični coaching",
                      inače bi čuo tri ista "Prijavi se" i ne bi znao koje je koje */}
                  <span className="sr-only"> za {pkg.name}</span>
                </Link>
                {pkg.price_label && (
                  <p className="mt-3 text-center text-sm text-brand-muted">
                    Cijena: {pkg.price_label}
                  </p>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
