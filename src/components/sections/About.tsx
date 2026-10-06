import { getImageProps } from "next/image";
import { Button } from "@/components/ui/Button";
import { about } from "@/content/site";

export function About() {
  const common = { alt: "Adnan Gosto pozira", sizes: "100vw" };
  const {
    props: { srcSet: desktop },
  } = getImageProps({ ...common, src: "/images/stage-pose.jpg", width: 1920, height: 725 });
  const {
    props: { srcSet: mobile, ...rest },
  } = getImageProps({ ...common, src: "/images/stage-pose-mobile.jpg", width: 595, height: 725 });

  return (
    <section id="o-meni" className="scroll-mt-24">
      <div className="relative isolate overflow-hidden">
        <picture className="absolute inset-0 -z-20">
          <source media="(min-width: 768px)" srcSet={desktop} />
          <source srcSet={mobile} />
          <img
            {...rest}
            alt="Adnan Gosto pozira"
            loading="lazy"
            className="h-full w-full object-cover object-top md:object-[75%_center]"
          />
        </picture>
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
            <Button href="/o-meni" className="mt-8 min-h-14 px-8 text-lg">
              Cijela priča i titule
            </Button>
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
