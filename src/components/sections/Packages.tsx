import Link from "next/link";
import { getPackages } from "@/lib/content";

function Check() {
  return (
    <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-brand-yellow">
      <svg viewBox="0 0 24 24" aria-hidden="true" className="size-3.5" fill="none">
        <path
          d="m6 12.5 4 4 8-9"
          stroke="#0a0a0a"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}

export async function Packages() {
  const packages = await getPackages();

  return (
    <section
      id="saradnja"
      className="scroll-mt-16 bg-brand-paper px-5 py-24 text-brand-black lg:py-32"
    >
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-6 lg:grid-cols-2 lg:items-end">
          <h2 className="font-display text-6xl leading-[0.9] sm:text-7xl lg:text-8xl">
            Izaberi kako
            <br />
            radimo
          </h2>
          <p className="max-w-lg text-lg text-brand-ink-muted lg:justify-self-end">
            Svaki paket ima svoju prijavu. Odgovoriš na pitanja bitna baš za tvoj cilj, a ja dobijem
            sve što trebam da ti se javim s konkretnim prijedlogom.
          </p>
        </div>

        <ul className="mt-14 grid gap-5 lg:grid-cols-3">
          {packages.map((pkg, i) => {
            const dark = i === 1;
            return (
              <li
                key={pkg.slug}
                className={`group relative flex flex-col overflow-hidden rounded-2xl p-7 transition-transform duration-300 hover:-translate-y-1 lg:p-9 ${
                  dark
                    ? "bg-brand-black text-white"
                    : "border border-brand-paper-line bg-white text-brand-black"
                }`}
              >
                <span
                  aria-hidden="true"
                  className="absolute top-0 right-0 h-full w-14 bg-brand-yellow opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                  style={{ clipPath: "polygon(70% 0, 100% 0, 100% 100%, 0 100%)" }}
                />
                {pkg.duration && (
                  <p
                    className={`font-display text-2xl ${dark ? "text-brand-yellow" : "text-brand-ink-muted"}`}
                  >
                    {pkg.duration}
                  </p>
                )}
                <h3 className="mt-1 font-display text-5xl leading-none">{pkg.name}</h3>
                {pkg.audience && (
                  <p className={`mt-5 font-semibold ${dark ? "text-white" : "text-brand-black"}`}>
                    {pkg.audience}
                  </p>
                )}
                {pkg.tagline && (
                  <p className={`mt-2 ${dark ? "text-brand-muted" : "text-brand-ink-muted"}`}>
                    {pkg.tagline}
                  </p>
                )}
                <ul className="mt-7 space-y-3">
                  {pkg.features.map((f) => (
                    <li key={f} className="flex items-start gap-3">
                      <Check />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-auto pt-10">
                  <Link
                    href={`/prijava/${pkg.slug}`}
                    className={`flex min-h-14 items-center justify-center rounded-md text-lg font-semibold transition-colors ${
                      dark
                        ? "bg-brand-yellow text-brand-black hover:bg-white"
                        : "bg-brand-black text-white hover:bg-brand-yellow hover:text-brand-black"
                    }`}
                  >
                    Prijavi se
                    <span className="sr-only"> za {pkg.name}</span>
                  </Link>
                  {pkg.price_label && (
                    <p
                      className={`mt-3 text-center text-sm ${dark ? "text-brand-muted" : "text-brand-ink-muted"}`}
                    >
                      Cijena {pkg.price_label}
                    </p>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
