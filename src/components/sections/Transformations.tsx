import Image from "next/image";
import { getTransformations, mediaUrl } from "@/lib/content";

export async function Transformations() {
  const items = await getTransformations();
  if (items.length === 0) return null;

  return (
    <section
      id="transformacije"
      className="scroll-mt-24 bg-brand-paper px-5 py-24 text-brand-black lg:py-32"
    >
      <div className="mx-auto max-w-7xl">
        <h2 className="font-display text-6xl leading-[0.9] sm:text-7xl lg:text-8xl">
          Transformacije
        </h2>
        <ul className="mt-14 grid gap-6 md:grid-cols-3">
          {items.map((t) => (
            <li key={t.client_name} className="rounded-2xl bg-white p-4">
              <div className="grid grid-cols-2 gap-2">
                {[
                  [t.before_image, "Prije"],
                  [t.after_image, "Poslije"],
                ].map(([src, label]) => {
                  const url = mediaUrl(src);
                  return (
                    <figure
                      key={label}
                      className="relative aspect-[3/4] overflow-hidden rounded-lg bg-brand-paper-line"
                    >
                      {url && (
                        <Image
                          src={url}
                          alt={`${t.client_name}, ${label}`}
                          fill
                          sizes="(min-width: 768px) 200px, 45vw"
                          className="object-cover"
                        />
                      )}
                      <figcaption className="absolute top-2 left-2 rounded bg-brand-black px-2 py-0.5 text-xs font-semibold text-white">
                        {label}
                      </figcaption>
                    </figure>
                  );
                })}
              </div>
              <div className="px-1 pt-4">
                {t.result && <p className="font-display text-2xl">{t.result}</p>}
                <p className="font-semibold">{t.client_name}</p>
                {t.client_label && <p className="text-sm text-brand-ink-muted">{t.client_label}</p>}
                {t.testimonial && (
                  <blockquote className="mt-3 text-sm text-brand-ink-muted">
                    “{t.testimonial}”
                  </blockquote>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
