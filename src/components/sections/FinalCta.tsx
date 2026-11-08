import Image from "next/image";
import Link from "next/link";
import { site } from "@/content/site";
import { contactLink } from "@/lib/contact";
import { ArrowRightIcon, InstagramIcon, WhatsAppIcon } from "@/components/ui/icons";

export function FinalCta() {
  const chat = contactLink("Zdravo Adnane, zanima me saradnja.");
  const wa = chat.kind === "whatsapp";

  return (
    <section
      id="kontakt"
      className="relative mt-32 scroll-mt-24 overflow-x-clip bg-brand-yellow px-5 text-brand-black lg:mt-48"
    >
      <div className="mx-auto grid max-w-7xl lg:min-h-[600px] lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <div className="relative z-10 order-2 py-14 lg:order-1 lg:py-24">
          <h2 className="font-display text-7xl leading-[0.84] sm:text-8xl lg:text-[9rem]">
            Spreman za
            <br />
            prvi korak?
          </h2>
          <p className="mt-6 max-w-md text-lg font-medium text-brand-black/75">
            Izaberi paket, popuni upitnik i javljam ti se na mail s dogovorom oko početka.
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <Link
              href="/#saradnja"
              className="group inline-flex min-h-14 items-center gap-3 rounded-full bg-brand-black py-2 pr-2 pl-7 text-lg font-bold text-white transition-colors hover:bg-[#262626]"
            >
              Pogledaj pakete
              <span className="grid size-10 place-items-center rounded-full bg-brand-yellow text-brand-black transition-transform duration-300 group-hover:translate-x-1">
                <ArrowRightIcon className="size-5" />
              </span>
            </Link>
            <a
              href={chat.href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-14 items-center gap-2.5 rounded-full border border-brand-black/25 px-6 text-lg font-semibold transition-colors hover:bg-brand-black hover:text-brand-yellow"
            >
              {wa ? <WhatsAppIcon className="size-5" /> : <InstagramIcon className="size-5" />}
              Pitaj me na {wa ? "WhatsAppu" : "Instagramu"}
            </a>
          </div>
          <a
            href={site.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-brand-black/70 transition-colors hover:text-brand-black"
          >
            <InstagramIcon className="size-4" />
            {site.instagramHandle}
          </a>
        </div>
        <div className="relative order-1 -mt-32 h-[380px] lg:order-2 lg:mt-0 lg:h-auto">
          <div
            aria-hidden="true"
            className="absolute inset-y-0 right-[18%] w-24 bg-brand-black lg:-top-48"
            style={{ clipPath: "polygon(70% 0, 100% 0, 30% 100%, 0 100%)" }}
          />
          <Image
            src="/images/cta-adnan-cut.webp"
            alt="Adnan Gosto"
            width={1400}
            height={1269}
            quality={90}
            sizes="(min-width: 1024px) 60vw, 125vw"
            className="absolute bottom-0 left-1/2 h-auto w-[125%] max-w-none -translate-x-[46%] [mask-image:linear-gradient(to_bottom,#000_72%,transparent)] drop-shadow-[0_30px_40px_rgba(0,0,0,0.35)] lg:-right-[18%] lg:left-auto lg:h-[122%] lg:w-auto lg:translate-x-0 lg:[mask-image:none]"
          />
        </div>
      </div>
    </section>
  );
}
