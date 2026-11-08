import Image from "next/image";
import Link from "next/link";
import { about } from "@/content/site";
import { careerStats, quote } from "@/content/about";
import { ArrowRightIcon } from "@/components/ui/icons";

const stats = [
  { value: "2011", label: "online coaching" },
  { value: "4×", label: "zaredom apsolutni prvak BiH" },
  { value: "77+", label: "zlata s takmičarima" },
];

export function About() {
  return (
    <section id="o-meni" className="relative scroll-mt-24 overflow-hidden px-5 py-24 lg:py-36">
      <div className="mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-24">
        <figure className="relative mx-auto w-full max-w-md lg:max-w-none">
          <div
            aria-hidden="true"
            className="absolute -top-8 -right-8 -bottom-8 left-1/3 -z-10 bg-brand-yellow"
            style={{ clipPath: "polygon(38% 0, 100% 0, 100% 100%, 0 100%)" }}
          />
          <div className="relative aspect-[4/5] overflow-hidden rounded-[28px] bg-brand-surface">
            <Image
              src="/images/om-profil.jpg"
              alt="Adnan Gosto"
              fill
              sizes="(min-width: 1024px) 40vw, 90vw"
              className="object-cover object-[50%_20%] contrast-[1.1] grayscale"
            />
            <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/85 to-transparent" />
            <figcaption className="absolute right-6 bottom-6 left-6 flex items-end justify-between gap-4">
              <span>
                <span className="block font-display text-6xl leading-none text-brand-yellow">
                  {careerStats[0].value}
                </span>
                <span className="text-sm font-semibold text-white/80">zlatnih medalja na bini</span>
              </span>
              <span className="rounded-full border border-white/25 bg-black/40 px-3 py-1.5 text-sm font-semibold backdrop-blur-md">
                IFBB Pro od 2021.
              </span>
            </figcaption>
          </div>
        </figure>

        <div>
          <span
            aria-hidden="true"
            className="block font-display text-[9rem] leading-[0.6] text-brand-yellow"
          >
            &ldquo;
          </span>
          <h2 className="mt-2 font-display text-5xl leading-[0.95] sm:text-6xl lg:text-[4.5rem]">
            {quote.text}
          </h2>
          <p className="mt-6 font-signature text-6xl leading-none text-brand-yellow">
            {quote.author}
          </p>
          <p className="mt-8 max-w-xl text-lg text-white/65">{about.paragraphs[0]}</p>
          <dl className="mt-10 grid grid-cols-3 border-y border-white/10">
            {stats.map((s, i) => (
              <div key={s.label} className={`py-6 ${i ? "border-l border-white/10 pl-5" : "pr-5"}`}>
                <dt className="font-display text-5xl leading-none lg:text-6xl">{s.value}</dt>
                <dd className="mt-2 text-sm text-white/55">{s.label}</dd>
              </div>
            ))}
          </dl>
          <Link
            href="/o-meni"
            className="group mt-10 inline-flex min-h-14 items-center gap-3 rounded-full bg-brand-yellow py-2 pr-2 pl-7 text-lg font-bold text-brand-black transition-colors hover:bg-white"
          >
            Upoznaj me, cijela priča i titule
            <span className="grid size-10 place-items-center rounded-full bg-brand-black text-brand-yellow transition-transform duration-300 group-hover:translate-x-1">
              <ArrowRightIcon className="size-5" />
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}
