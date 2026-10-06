import Image from "next/image";
import { CarouselIcon, InstagramIcon, ReelIcon } from "@/components/ui/icons";
import { site } from "@/content/site";
import { getInstagramPosts, type InstagramPost } from "@/lib/instagram";

const dateFormat = new Intl.DateTimeFormat("bs-BA", { day: "numeric", month: "short" });

function KindBadge({ kind }: { kind: InstagramPost["kind"] }) {
  if (kind === "IMAGE") return null;
  return (
    <span className="absolute top-2.5 right-2.5 grid size-7 place-items-center rounded-full bg-brand-black/60 text-white">
      {kind === "VIDEO" ? <ReelIcon className="size-3.5" /> : <CarouselIcon className="size-3.5" />}
      <span className="sr-only">{kind === "VIDEO" ? "Video" : "Više fotografija"}</span>
    </span>
  );
}

export async function InstagramFeed() {
  const posts = await getInstagramPosts(6);

  return (
    <section
      aria-labelledby="instagram-naslov"
      className="border-t border-brand-line px-5 py-24 lg:py-28"
    >
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="flex items-center gap-2 text-sm font-semibold tracking-[0.14em] text-brand-yellow uppercase">
              <InstagramIcon className="size-4" />
              {site.instagramHandle}
            </p>
            <h2
              id="instagram-naslov"
              className="mt-3 font-display text-6xl leading-[0.88] sm:text-7xl"
            >
              Svaki dan <span className="text-brand-yellow">u teretani</span>
            </h2>
          </div>
          <a
            href={site.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-12 items-center gap-2 self-start rounded-sm border border-white/20 px-6 text-[13px] font-bold tracking-[0.14em] uppercase transition-colors hover:border-brand-yellow hover:text-brand-yellow sm:self-auto"
          >
            <InstagramIcon className="size-4" />
            Prati na Instagramu
          </a>
        </div>

        <ul className="mt-12 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6 lg:gap-3">
          {posts.map((p) => (
            <li key={p.id}>
              <a
                href={p.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Otvori objavu na Instagramu: ${p.alt}`}
                className="group relative block aspect-square overflow-hidden rounded-lg bg-brand-surface"
              >
                <Image
                  src={p.src}
                  alt={p.alt}
                  fill
                  unoptimized={p.remote}
                  sizes="(min-width: 1024px) 200px, (min-width: 640px) 33vw, 50vw"
                  className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
                />
                <KindBadge kind={p.kind} />
                <span
                  className={`absolute inset-0 flex flex-col ${p.caption ? "justify-end" : "items-center justify-center"} bg-gradient-to-t from-brand-black/90 via-brand-black/40 to-transparent p-3 opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100`}
                >
                  {p.date && (
                    <span className="text-[11px] font-bold tracking-[0.14em] text-brand-yellow uppercase">
                      {dateFormat.format(new Date(p.date))}
                    </span>
                  )}
                  {p.caption ? (
                    <span className="mt-1 line-clamp-3 text-xs leading-snug text-white/90">
                      {p.caption}
                    </span>
                  ) : (
                    <InstagramIcon className="size-7 text-white" />
                  )}
                </span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
