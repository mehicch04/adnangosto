import Image from "next/image";
import { about } from "@/content/site";

export function About() {
  return (
    <section id="o-meni" className="scroll-mt-16">
      <div className="relative isolate overflow-hidden">
        <Image
          src="/images/stage-pose.jpg"
          alt="Adnan Gosto pozira"
          fill
          sizes="100vw"
          className="-z-20 object-cover object-[75%_center]"
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-brand-black via-brand-black/60 to-transparent lg:bg-gradient-to-r lg:from-brand-black lg:via-brand-black/70" />
        <div className="mx-auto flex min-h-[70svh] max-w-7xl items-end px-5 pt-40 pb-16 lg:min-h-[640px] lg:items-center lg:py-24">
          <div className="max-w-xl">
            <h2 className="font-display text-6xl leading-[0.9] sm:text-7xl lg:text-8xl">
              {about.title}
            </h2>
            {about.paragraphs.map((p) => (
              <p key={p.slice(0, 24)} className="mt-5 text-lg text-white/80">
                {p}
              </p>
            ))}
          </div>
        </div>
      </div>

      <div className="px-5 py-20 lg:py-28">
        <ol className="mx-auto grid max-w-7xl gap-px overflow-hidden rounded-2xl bg-brand-line sm:grid-cols-2 lg:grid-cols-4">
          {about.timeline.map((t) => (
            <li
              key={t.year}
              className="bg-brand-black p-6 transition-colors hover:bg-brand-surface lg:p-8"
            >
              <p className="font-display text-5xl leading-none text-brand-yellow">{t.year}</p>
              <p className="mt-3 text-white/85">{t.text}</p>
            </li>
          ))}
          <li className="bg-brand-yellow p-6 text-brand-black lg:p-8">
            <p className="font-display text-5xl leading-none">Danas</p>
            <p className="mt-3 font-semibold">Pripremam takmičare i držim edukacije za trenere</p>
          </li>
        </ol>
      </div>
    </section>
  );
}
