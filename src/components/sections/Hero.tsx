import { getImageProps } from "next/image";
import { Button } from "@/components/ui/Button";
import { hero } from "@/content/site";

export function Hero() {
  const common = { alt: "Adnan Gosto u teretani", sizes: "100vw", priority: true };
  const {
    props: { srcSet: desktop },
  } = getImageProps({ ...common, src: "/images/hero-gym.jpg", width: 1920, height: 725 });
  const {
    props: { srcSet: mobile, ...rest },
  } = getImageProps({ ...common, src: "/images/hero-gym-mobile.jpg", width: 800, height: 725 });

  return (
    <section className="relative isolate flex min-h-[100svh] items-end overflow-hidden lg:items-center">
      <picture className="absolute inset-0 -z-20">
        <source media="(min-width: 1024px)" srcSet={desktop} />
        <source srcSet={mobile} />
        <img
          {...rest}
          className="h-full w-full object-cover object-[60%_20%] lg:object-[22%_center]"
          alt={common.alt}
        />
      </picture>

      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-brand-black via-brand-black/70 to-brand-black/10 lg:bg-gradient-to-r lg:from-brand-black lg:via-brand-black/80 lg:to-transparent" />
      <div className="absolute inset-x-0 bottom-0 -z-10 h-40 bg-gradient-to-t from-brand-black to-transparent" />

      <div
        aria-hidden="true"
        className="absolute top-0 bottom-0 left-[50%] -z-10 hidden w-24 bg-brand-yellow lg:block"
        style={{ clipPath: "polygon(70% 0, 100% 0, 30% 100%, 0 100%)" }}
      />

      <span
        aria-hidden="true"
        className="text-outline pointer-events-none absolute right-[-2vw] bottom-[-4vw] -z-10 hidden font-display text-[18vw] leading-none whitespace-nowrap opacity-20 [--outline:#ffffff] lg:block"
      >
        Gosto
      </span>

      <div className="mx-auto w-full max-w-7xl px-5 pt-28 pb-14 lg:pt-32 lg:pb-24">
        <div className="max-w-2xl">
          <p className="flex animate-rise items-center gap-3 font-semibold text-brand-yellow">
            <span className="h-0.5 w-10 bg-brand-yellow" />
            {hero.kicker}
          </p>
          <h1 className="mt-5 font-display text-[clamp(4rem,15vw,9.5rem)] leading-[0.84]">
            <span className="block animate-rise [animation-delay:120ms]">{hero.title}</span>
            <span className="block animate-rise text-brand-yellow [animation-delay:240ms]">
              {hero.titleAccent}
            </span>
          </h1>
          <p className="mt-7 max-w-xl animate-rise text-lg text-white/80 [animation-delay:380ms] lg:text-xl">
            {hero.subtitle}
          </p>
          <div className="mt-9 flex animate-rise flex-col gap-3 [animation-delay:500ms] sm:flex-row">
            <Button href={hero.primaryCta.href} className="min-h-14 px-8 text-lg">
              {hero.primaryCta.label}
            </Button>
            <Button href={hero.secondaryCta.href} variant="ghost" className="min-h-14 px-8 text-lg">
              {hero.secondaryCta.label}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
