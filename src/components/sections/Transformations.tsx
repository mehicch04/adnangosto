import Link from "next/link";
import { transformationPhotos } from "@/content/site";
import { TransformationsGrid } from "@/components/sections/TransformationsGrid";

const steps = [
  { label: "Prije", text: "Lijeva fotografija je stanje na početku saradnje." },
  { label: "Poslije", text: "Desna fotografija je forma nakon programa." },
];

export function Transformations() {
  if (transformationPhotos.length === 0) return null;

  return (
    <section
      id="transformacije"
      aria-labelledby="transformacije-naslov"
      className="scroll-mt-24 bg-brand-paper px-5 py-24 text-brand-black lg:py-32"
    >
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-end lg:gap-16">
          <div>
            <p className="flex items-center gap-3 text-sm font-bold tracking-[0.2em] uppercase">
              <span className="h-0.5 w-8 bg-brand-yellow" />
              Transformacije klijenata
            </p>
            <h2
              id="transformacije-naslov"
              className="mt-4 font-display text-6xl leading-[0.88] sm:text-7xl lg:text-[7.5rem]"
            >
              Prije.{" "}
              <span className="relative inline-block">
                <span className="absolute inset-x-0 bottom-[0.08em] -z-0 h-[0.32em] bg-brand-yellow" />
                <span className="relative">Poslije.</span>
              </span>
            </h2>
          </div>
          <div>
            <p className="max-w-md text-lg text-brand-ink-muted">
              Ljudi koji su krenuli od nule, s viškom kilograma ili bez napretka godinama. Isti
              plan, ista disciplina, rezultat se vidi.
            </p>
            <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-3">
              {steps.map((s, i) => (
                <li key={s.label} className="flex items-center gap-3 text-sm">
                  <span
                    className={`rounded-sm px-2 py-0.5 text-[11px] font-bold tracking-[0.16em] uppercase ${
                      i === 0 ? "bg-brand-black text-white" : "bg-brand-yellow text-brand-black"
                    }`}
                  >
                    {s.label}
                  </span>
                  <span className="text-brand-ink-muted">{s.text}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <TransformationsGrid photos={transformationPhotos} />

        <div className="mt-16 flex flex-col items-start justify-between gap-6 border-t-2 border-brand-black pt-8 sm:flex-row sm:items-center">
          <p className="font-display text-4xl leading-none sm:text-5xl">
            Sljedeća može biti tvoja.
          </p>
          <Link
            href="/#saradnja"
            className="inline-flex min-h-12 items-center rounded-sm bg-brand-black px-7 text-[13px] font-bold tracking-[0.14em] text-white uppercase transition-colors hover:bg-brand-yellow hover:text-brand-black"
          >
            Izaberi saradnju
          </Link>
        </div>
      </div>
    </section>
  );
}
