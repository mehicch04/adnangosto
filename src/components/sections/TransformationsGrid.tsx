"use client";

import Image from "next/image";
import { useState } from "react";

type Photo = { src: string; alt: string };

export function TransformationsGrid({
  photos,
  initial = 6,
}: {
  photos: Photo[];
  initial?: number;
}) {
  const [all, setAll] = useState(false);
  const visible = all ? photos : photos.slice(0, initial);

  return (
    <>
      <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:mt-16 lg:grid-cols-3 lg:gap-6">
        {visible.map((p, i) => (
          <li
            key={p.src}
            className={i >= initial ? "animate-rise" : !all && i >= 4 ? "max-sm:hidden" : undefined}
          >
            <figure className="group relative overflow-hidden rounded-lg bg-brand-paper-line shadow-[0_20px_40px_-24px_rgba(10,10,10,0.45)]">
              <Image
                src={p.src}
                alt={p.alt}
                width={720}
                height={720}
                sizes="(min-width: 1024px) 400px, (min-width: 640px) 50vw, 100vw"
                className="aspect-square w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
              />
              <span className="absolute top-3 left-3 rounded-sm bg-brand-black/80 px-2.5 py-1 text-[11px] font-bold tracking-[0.16em] text-white uppercase">
                Prije
              </span>
              <span className="absolute top-3 right-3 rounded-sm bg-brand-yellow px-2.5 py-1 text-[11px] font-bold tracking-[0.16em] text-brand-black uppercase">
                Poslije
              </span>
              <figcaption className="sr-only">{p.alt}</figcaption>
            </figure>
          </li>
        ))}
      </ul>

      {photos.length > initial && (
        <div className="mt-10 flex justify-center">
          <button
            type="button"
            onClick={() => setAll((v) => !v)}
            aria-expanded={all}
            className="inline-flex min-h-12 items-center gap-3 rounded-sm border-2 border-brand-black px-7 text-[13px] font-bold tracking-[0.14em] uppercase transition-colors hover:bg-brand-black hover:text-white"
          >
            {all ? "Prikaži manje" : `Prikaži sve transformacije (${photos.length})`}
          </button>
        </div>
      )}
    </>
  );
}
