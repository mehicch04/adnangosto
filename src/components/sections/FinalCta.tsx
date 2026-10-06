import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { InstagramIcon } from "@/components/ui/icons";
import { site } from "@/content/site";

export function FinalCta() {
  return (
    <section
      id="kontakt"
      className="relative isolate scroll-mt-24 overflow-hidden px-5 py-28 lg:py-44"
    >
      <Image
        src="/images/om-ledja-krov.jpg"
        alt=""
        fill
        sizes="100vw"
        className="-z-20 object-cover object-[50%_30%] grayscale"
      />
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-brand-black via-brand-black/85 to-brand-black/40" />
      <div className="mx-auto max-w-7xl">
        <h2 className="max-w-4xl font-display text-[clamp(4rem,12vw,10rem)] leading-[0.85]">
          Spreman za
          <br />
          <span className="text-brand-yellow">prvi korak?</span>
        </h2>
        <p className="mt-8 max-w-md text-lg text-white/80">
          Izaberi paket, popuni prijavu za par minuta i javljam ti se s konkretnim prijedlogom.
        </p>
        <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4">
          <Button href="/#saradnja" className="min-h-14 px-8 text-lg">
            Izaberi saradnju
          </Button>
          <a
            href={site.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 font-semibold text-white transition-colors hover:text-brand-yellow"
          >
            <InstagramIcon />
            {site.instagramHandle}
          </a>
        </div>
      </div>
    </section>
  );
}
