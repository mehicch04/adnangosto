/*
  REZULTATI: transformacije klijenata, prije i poslije.

  Dvije situacije:
    - ima transformacija u bazi -> prikaži ih
    - nema još (sada) -> prikaži tri okvira koja pokazuju kako će izgledati,
      da Adnan na pregledu vidi gdje idu njegove fotografije
*/
import Image from "next/image";
import { getTransformations, mediaUrl } from "@/lib/content";

function Photo({ src, label }: { src: string | null; label: string }) {
  return (
    <figure className="relative aspect-[3/4] overflow-hidden rounded-md bg-brand-raised">
      {src ? (
        <Image
          src={src}
          alt={label}
          fill
          sizes="(min-width: 768px) 180px, 45vw"
          className="object-cover"
        />
      ) : (
        // prazan okvir dok slika ne stigne
        <div className="grid h-full place-items-center text-sm text-brand-muted/60">
          Fotografija
        </div>
      )}
      <figcaption className="absolute top-2 left-2 rounded bg-brand-black/80 px-2 py-0.5 text-xs font-semibold">
        {label}
      </figcaption>
    </figure>
  );
}

export async function Transformations() {
  const items = await getTransformations();

  // Dok nema pravih podataka, tri prazna mjesta pokazuju raspored
  const cards =
    items.length > 0
      ? items
      : Array.from({ length: 3 }, (_, i) => ({
          client_name: `Klijent ${i + 1}`,
          client_label: "Takmičar ili rekreativac",
          result: "Rezultat s brojkama, npr. -12 kg za 16 sedmica",
          testimonial: null,
          before_image: null,
          after_image: null,
        }));

  return (
    <section id="rezultati" className="scroll-mt-20 px-5 py-20 lg:py-28">
      <div className="mx-auto max-w-6xl">
        <div className="max-w-2xl">
          <h2 className="font-display text-5xl leading-none sm:text-6xl">Rezultati</h2>
          <p className="mt-4 text-lg text-brand-muted">
            Stvarni ljudi i stvarne promjene. Svaka transformacija je rađena po planu složenom za
            tog čovjeka.
          </p>
        </div>

        <ul className="mt-12 grid gap-6 md:grid-cols-3">
          {cards.map((t) => (
            <li key={t.client_name} className="rounded-xl border border-brand-line p-4">
              <div className="grid grid-cols-2 gap-2">
                <Photo src={mediaUrl(t.before_image)} label="Prije" />
                <Photo src={mediaUrl(t.after_image)} label="Poslije" />
              </div>
              <div className="px-1 pt-4 pb-1">
                {t.result && <p className="font-semibold text-brand-yellow">{t.result}</p>}
                <p className="mt-1 font-semibold">{t.client_name}</p>
                {t.client_label && <p className="text-sm text-brand-muted">{t.client_label}</p>}
                {t.testimonial && (
                  <blockquote className="mt-3 text-sm text-brand-muted italic">
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
