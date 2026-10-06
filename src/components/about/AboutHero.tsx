import Image from "next/image";
import { profileFacts } from "@/content/about";

export function AboutHero() {
  return (
    <section className="relative isolate overflow-hidden pt-16 lg:pt-20">
      <div className="mx-auto grid max-w-7xl items-end gap-10 px-5 lg:grid-cols-[1.15fr_0.85fr] lg:gap-0">
        <div className="relative z-10 pt-10 pb-6 lg:pt-24 lg:pb-24">
          <p className="flex animate-rise items-center gap-3 font-semibold text-brand-yellow">
            <span className="h-0.5 w-10 bg-brand-yellow" />O meni
          </p>
          <h1 className="mt-5 font-display text-[clamp(4.5rem,17vw,11rem)] leading-[0.82]">
            <span className="block animate-rise [animation-delay:120ms]">Adnan</span>
            <span className="block animate-rise [animation-delay:220ms]">Gosto</span>
            <span className="text-outline block animate-rise [animation-delay:320ms]">
              IFBB Pro
            </span>
          </h1>
          <p className="mt-8 max-w-lg animate-rise text-lg text-white/80 [animation-delay:440ms] lg:text-xl">
            Trener, takmičar i čovjek koji je od hobija napravio posao. Petnaest godina u teretani,
            na bini i uz takmičare koje sam doveo do pro karata.
          </p>
          <dl className="mt-12 grid max-w-xl animate-rise grid-cols-2 gap-px overflow-hidden rounded-xl bg-brand-line [animation-delay:560ms] sm:grid-cols-4">
            {profileFacts.map((f) => (
              <div key={f.label} className="bg-brand-black p-4">
                <dt className="font-display text-3xl leading-none text-brand-yellow">{f.value}</dt>
                <dd className="mt-1.5 text-xs text-brand-muted">{f.label}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="relative mx-auto aspect-[4/5] w-full max-w-md lg:aspect-auto lg:h-full lg:max-w-none">
          <div
            aria-hidden="true"
            className="absolute inset-0 -translate-x-6 bg-brand-yellow"
            style={{ clipPath: "polygon(22% 0, 27% 0, 5% 100%, 0 100%)" }}
          />
          <div
            className="absolute inset-0"
            style={{ clipPath: "polygon(22% 0, 100% 0, 100% 100%, 0 100%)" }}
          >
            <Image
              src="/images/om-majica.jpg"
              alt="Adnan Gosto u teretani"
              fill
              priority
              sizes="(min-width: 1024px) 45vw, 90vw"
              className="object-cover object-top"
            />
            <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-brand-black to-transparent" />
          </div>
        </div>
      </div>
    </section>
  );
}
