import { getImageProps } from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { hero, stats } from "@/content/site";

export function Hero() {
  const common = { alt: "Adnan Gosto u teretani", sizes: "100vw", priority: true };
  const {
    props: { srcSet: desktop },
  } = getImageProps({ ...common, src: "/images/hero-gym.jpg", width: 1920, height: 725 });
  const {
    props: { srcSet: mobile, ...rest },
  } = getImageProps({ ...common, src: "/images/hero-gym-mobile.jpg", width: 800, height: 725 });

  return (
    <section className="relative isolate flex min-h-[100svh] flex-col overflow-hidden">
      <picture className="absolute inset-0 -z-20">
        <source media="(min-width: 1024px)" srcSet={desktop} />
        <source srcSet={mobile} />
        <img
          {...rest}
          alt={common.alt}
          className="h-full w-full object-cover object-[60%_20%] lg:object-[22%_center]"
        />
      </picture>
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-brand-black via-brand-black/60 to-brand-black/20 lg:bg-gradient-to-r lg:from-brand-black lg:via-brand-black/75 lg:to-brand-black/10" />
      <div className="absolute inset-x-0 bottom-0 -z-10 h-1/2 bg-gradient-to-t from-brand-black to-transparent" />
      <div
        aria-hidden="true"
        className="absolute top-24 bottom-0 left-[47%] -z-10 hidden w-24 bg-brand-yellow lg:block"
        style={{ clipPath: "polygon(70% 0, 100% 0, 30% 100%, 0 100%)" }}
      />

      <div className="mx-auto flex w-full max-w-7xl flex-1 items-end px-5 pt-28 pb-10 lg:items-center lg:pt-36 lg:pb-12">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold tracking-[0.2em] text-brand-yellow uppercase">
            {hero.kicker}
          </p>
          <h1 className="mt-5 font-display text-[clamp(4rem,15vw,10rem)] leading-[0.82]">
            <span className="block">{hero.title}</span>
            <span className="block text-brand-yellow">{hero.titleAccent}</span>
          </h1>
          <p className="mt-7 max-w-lg text-lg text-white/75">{hero.subtitle}</p>
          <div className="mt-9 flex flex-wrap items-center gap-x-8 gap-y-4">
            <Button href={hero.primaryCta.href} className="min-h-14 px-8 text-lg">
              {hero.primaryCta.label}
            </Button>
            <Link
              href={hero.secondaryCta.href}
              className="group inline-flex items-center gap-3 font-semibold text-white"
            >
              <span className="h-px w-8 bg-white transition-all group-hover:w-12 group-hover:bg-brand-yellow" />
              {hero.secondaryCta.label}
            </Link>
          </div>
        </div>
      </div>

      <div className="border-t border-white/15 bg-brand-black/70 backdrop-blur-md">
        <dl className="mx-auto grid w-full max-w-7xl grid-cols-2 px-5 lg:grid-cols-4">
          {stats.map((s, i) => (
            <div
              key={s.label}
              className={`py-6 lg:py-8 ${i % 2 === 1 ? "pl-5 lg:pl-8" : "pr-5 lg:pr-8"} ${
                i > 0 ? "lg:border-l lg:border-white/15 lg:pl-8" : ""
              } ${i < 2 ? "border-b border-white/15 lg:border-b-0" : ""}`}
            >
              <dt className="font-display text-5xl leading-none text-white lg:text-6xl">
                {s.value}
              </dt>
              <dd className="mt-2 max-w-[14rem] text-sm text-white/60">{s.label}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
