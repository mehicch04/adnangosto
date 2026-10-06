import Image from "next/image";
import { careerStats } from "@/content/about";

export function StageBand() {
  return (
    <section aria-label="Karijera u brojkama" className="relative isolate overflow-hidden">
      <Image
        src="/images/om-krov-siroko.jpg"
        alt="Adnan Gosto na krovu, poza leđa"
        fill
        sizes="100vw"
        className="-z-20 object-cover object-[50%_35%]"
      />
      <div className="absolute inset-0 -z-10 bg-brand-black/70" />
      <div className="mx-auto max-w-7xl px-5 py-24 lg:py-36">
        <p className="max-w-3xl font-display text-5xl leading-[0.95] sm:text-6xl lg:text-7xl">
          Najuspješniji takmičar BiH četiri godine zaredom,{" "}
          <span className="text-brand-yellow">od 2012. do 2015.</span>
        </p>
        <dl className="mt-14 grid grid-cols-2 gap-px overflow-hidden rounded-2xl bg-white/10 backdrop-blur-sm lg:grid-cols-4">
          {careerStats.map((s) => (
            <div key={s.label} className="bg-brand-black/60 p-6 lg:p-8">
              <dt className="font-display text-6xl leading-none text-brand-yellow lg:text-8xl">
                {s.value}
              </dt>
              <dd className="mt-2 text-sm text-white/80 lg:text-base">{s.label}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
