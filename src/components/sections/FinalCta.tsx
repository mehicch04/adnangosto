import { Button } from "@/components/ui/Button";
import { InstagramIcon } from "@/components/ui/icons";
import { site } from "@/content/site";

export function FinalCta() {
  return (
    <section
      id="kontakt"
      className="relative isolate scroll-mt-16 overflow-hidden px-5 py-28 lg:py-40"
    >
      <div
        aria-hidden="true"
        className="absolute inset-y-0 right-[-10%] -z-10 hidden w-[55%] bg-brand-yellow lg:block"
        style={{ clipPath: "polygon(35% 0, 100% 0, 100% 100%, 0 100%)" }}
      />
      <div className="mx-auto max-w-7xl">
        <h2 className="max-w-4xl font-display text-[clamp(4rem,12vw,10rem)] leading-[0.85]">
          Spreman za
          <br />
          prvi korak?
        </h2>
        <p className="mt-8 max-w-md text-lg text-white/80">
          Izaberi paket, popuni prijavu za par minuta i javljam ti se s konkretnim prijedlogom.
        </p>
        <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
          <Button href="/#saradnja" className="min-h-14 px-8 text-lg">
            Izaberi saradnju
          </Button>
          <a
            href={site.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-14 items-center gap-2 rounded-md bg-brand-black/80 px-5 font-semibold transition-colors hover:text-brand-yellow"
          >
            <InstagramIcon />
            {site.instagramHandle}
          </a>
        </div>
      </div>
    </section>
  );
}
