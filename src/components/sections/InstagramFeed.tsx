import Image from "next/image";
import { InstagramIcon } from "@/components/ui/icons";
import { site } from "@/content/site";
import { getInstagramPosts } from "@/lib/instagram";

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
                <span className="absolute inset-0 grid place-items-center bg-brand-black/0 transition-colors duration-300 group-hover:bg-brand-black/50">
                  <InstagramIcon className="size-7 text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                </span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
