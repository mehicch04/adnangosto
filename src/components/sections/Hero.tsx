import { getImageProps } from "next/image";
import { preload } from "react-dom";
import type { CSSProperties } from "react";
import { hero, heroProof } from "@/content/site";
import { contactLink } from "@/lib/contact";
import { ArrowRightIcon, InstagramIcon, TickIcon, WhatsAppIcon } from "@/components/ui/icons";
import { HeroPaths } from "@/components/sections/HeroPaths";
import { HeroDepth } from "@/components/sections/HeroDepth";

const delay = (s: number) => ({ "--d": `${s}s` }) as CSSProperties;
const sizes = { desktop: "140vw", mobile: "175vw" };
const fit = "absolute inset-0 h-full w-full object-cover object-[50%_10%] lg:object-[58%_22%]";

function layer(wide: string, tall: string, alt: string, quality: number, lead: boolean) {
  const common = {
    alt,
    quality,
    loading: "eager" as const,
    fetchPriority: lead ? ("high" as const) : ("auto" as const),
  };
  const {
    props: { srcSet: desktop, src: desktopSrc },
  } = getImageProps({ ...common, src: wide, width: 3200, height: 1800, sizes: sizes.desktop });
  const {
    props: { srcSet: mobile, ...rest },
  } = getImageProps({ ...common, src: tall, width: 1259, height: 1800, sizes: sizes.mobile });
  if (lead) {
    const options = { as: "image" as const, fetchPriority: "high" as const };
    preload(desktopSrc, {
      ...options,
      imageSrcSet: desktop,
      imageSizes: sizes.desktop,
      media: "(min-width: 1024px)",
    });
    preload(rest.src, {
      ...options,
      imageSrcSet: mobile,
      imageSizes: sizes.mobile,
      media: "(max-width: 1023.98px)",
    });
  }
  return { desktop, mobile, rest };
}

export function Hero() {
  const photo = layer(
    "/images/hero-adnan-wide.jpg",
    "/images/om-majica.jpg",
    "Adnan Gosto u teretani",
    75,
    true,
  );
  const front = layer(
    "/images/hero-adnan-wide-cut.webp",
    "/images/hero-adnan-cut.webp",
    "",
    90,
    false,
  );
  const chat = contactLink();
  const wa = chat.kind === "whatsapp";

  return (
    <section id="hero" className="relative isolate min-h-[100svh] overflow-hidden bg-brand-black">
      <HeroDepth target="hero" />
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="hero-zoom absolute inset-0">
          <picture>
            <source media="(min-width: 1024px)" srcSet={photo.desktop} sizes={sizes.desktop} />
            <source srcSet={photo.mobile} sizes={sizes.mobile} />
            <img {...photo.rest} alt="Adnan Gosto u teretani" className={fit} />
          </picture>
          <div
            aria-hidden="true"
            className="hero-depth absolute inset-x-0 top-[100px] lg:top-[128px]"
          >
            <p className="text-center font-display text-[42vw] leading-[0.8] tracking-[-0.01em] text-brand-yellow select-none lg:pl-[16%] lg:text-[28vw]">
              {"GOSTO".split("").map((ch, i) => (
                <span key={i} className="hero-letter" style={delay(0.2 + i * 0.06)}>
                  {ch}
                </span>
              ))}
            </p>
          </div>
          <picture>
            <source media="(min-width: 1024px)" srcSet={front.desktop} sizes={sizes.desktop} />
            <source srcSet={front.mobile} sizes={sizes.mobile} />
            <img {...front.rest} alt="" aria-hidden="true" className={fit} />
          </picture>
        </div>
        <div className="absolute inset-0 hidden bg-gradient-to-r from-brand-black/80 to-transparent to-28% lg:block" />
        <div className="absolute inset-0 hidden bg-[radial-gradient(80%_75%_at_0%_100%,rgba(10,10,10,0.96)_35%,transparent_72%)] lg:block" />
        <div className="absolute inset-x-0 bottom-0 h-[62%] bg-gradient-to-t from-brand-black via-brand-black/85 via-45% to-transparent lg:h-[42%] lg:via-brand-black/50 lg:via-50%" />
        <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-black/50 to-transparent" />
        <div aria-hidden="true" className="hero-lights absolute inset-0 bg-brand-black" />
      </div>

      <div className="relative mx-auto flex min-h-[100svh] w-full max-w-7xl flex-col justify-end px-5 pt-[50svh] pb-10 lg:pt-28 lg:pb-12">
        <div className="grid items-end gap-10 lg:grid-cols-[minmax(0,1fr)_auto]">
          <div className="max-w-xl">
            <h1 className="font-display text-[clamp(3.5rem,11vw,6.5rem)] leading-[0.86]">
              <span className="block">{hero.title}</span>
              <span className="block">{hero.titleAccent}</span>
            </h1>
            <p className="mt-5 max-w-md text-[17px] text-white/75">{hero.subtitle}</p>
            <div className="fade-up mt-7 flex items-center gap-3" style={delay(0.63)}>
              <a
                href={hero.primaryCta.href}
                className="group inline-flex h-12 items-center gap-2.5 rounded-full bg-brand-yellow pr-1.5 pl-5 text-[15px] font-bold text-brand-black transition-colors hover:bg-white"
              >
                {hero.primaryCta.label}
                <span className="grid size-9 place-items-center rounded-full bg-brand-black text-brand-yellow transition-transform duration-300 group-hover:translate-x-0.5">
                  <ArrowRightIcon className="size-4" />
                </span>
              </a>
              <a
                href={chat.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Pitaj me na ${wa ? "WhatsAppu" : "Instagramu"}`}
                className="group inline-flex h-12 items-center gap-2 rounded-full border border-white/20 bg-black/40 px-3.5 text-[15px] font-semibold text-white/85 backdrop-blur transition-colors hover:border-white/50 hover:text-white sm:px-5"
              >
                {wa ? (
                  <WhatsAppIcon className="size-5 text-[#25D366]" />
                ) : (
                  <InstagramIcon className="size-5 text-brand-yellow" />
                )}
                <span className="hidden sm:inline">Pitaj me</span>
              </a>
            </div>
            <div className="fade-up mt-7 border-t border-white/10 pt-5" style={delay(0.7)}>
              <HeroPaths />
            </div>
          </div>
          <ul
            className="fade-up hidden w-72 divide-y divide-white/10 rounded-2xl border border-white/10 bg-black/60 px-4 lg:block"
            style={delay(0.75)}
          >
            {heroProof.map((t) => (
              <li
                key={t}
                className="flex items-center gap-3 py-3.5 text-[15px] font-semibold text-white/90"
              >
                <span className="grid size-6 shrink-0 place-items-center rounded-full bg-brand-yellow text-brand-black">
                  <TickIcon className="size-3.5" />
                </span>
                {t}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
