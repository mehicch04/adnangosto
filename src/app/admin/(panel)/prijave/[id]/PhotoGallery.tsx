"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, ExternalIcon, XIcon } from "@/components/admin/icons";

export function PhotoGallery({ photos, name }: { photos: string[]; name: string }) {
  const [index, setIndex] = useState<number | null>(null);
  const ref = useRef<HTMLDialogElement>(null);
  const count = photos.length;
  const step = (d: number) => setIndex((i) => (i === null ? i : (i + d + count) % count));

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (index !== null && !d.open) d.showModal();
    if (index === null && d.open) d.close();
  }, [index]);

  const nav =
    "grid size-12 place-items-center rounded-full border border-white/15 bg-black/60 text-white backdrop-blur transition-colors hover:bg-white hover:text-brand-black";

  return (
    <>
      <ul className="grid grid-cols-3 gap-2 sm:gap-3">
        {photos.map((src, i) => (
          <li key={src}>
            <button
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`Otvori sliku ${i + 1} od ${count}`}
              className="group relative block aspect-[3/4] w-full overflow-hidden rounded-xl bg-white/[0.04] outline-none focus-visible:ring-2 focus-visible:ring-brand-yellow/70 focus-visible:outline-none!"
            >
              <Image
                src={src}
                alt=""
                fill
                unoptimized
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <span className="absolute bottom-2 left-2 rounded-md bg-black/60 px-1.5 py-0.5 text-[11px] font-semibold text-white/80 backdrop-blur">
                {i + 1}
              </span>
            </button>
          </li>
        ))}
      </ul>

      <dialog
        ref={ref}
        aria-label={`Slike, ${name}`}
        onClose={() => setIndex(null)}
        onClick={(e) => e.target === e.currentTarget && setIndex(null)}
        onKeyDown={(e) => {
          if (e.key === "ArrowRight") step(1);
          if (e.key === "ArrowLeft") step(-1);
        }}
        className="fade-in m-0 h-[100svh] max-h-none w-screen max-w-none bg-black/95 p-0 text-white backdrop:bg-black/80"
      >
        {index !== null && (
          <div
            className="relative flex h-full flex-col"
            onClick={(e) => e.target === e.currentTarget && setIndex(null)}
          >
            <div className="flex items-center gap-3 px-4 py-3 sm:px-6">
              <p className="text-sm font-semibold tabular-nums">
                {index + 1} / {count}
              </p>
              <a
                href={photos[index]}
                target="_blank"
                rel="noopener noreferrer"
                className="ml-auto inline-flex h-10 items-center gap-2 rounded-xl px-3 text-[13px] font-semibold text-white/70 hover:bg-white/10 hover:text-white"
              >
                <ExternalIcon className="size-4" />
                Original
              </a>
              <button
                type="button"
                aria-label="Zatvori"
                onClick={() => setIndex(null)}
                className="grid size-10 place-items-center rounded-xl text-white/70 hover:bg-white/10 hover:text-white"
              >
                <XIcon className="size-5" />
              </button>
            </div>
            <div
              className="relative mx-4 mb-4 flex-1 sm:mx-20 sm:mb-8"
              onClick={(e) => e.target === e.currentTarget && setIndex(null)}
            >
              <Image
                key={photos[index]}
                src={photos[index]}
                alt={`Slika ${index + 1} od ${count}`}
                fill
                unoptimized
                className="fade-in object-contain"
              />
            </div>
            {count > 1 && (
              <>
                <button
                  type="button"
                  aria-label="Prethodna slika"
                  onClick={() => step(-1)}
                  className={`absolute top-1/2 left-3 -translate-y-1/2 sm:left-5 ${nav}`}
                >
                  <ChevronLeft className="size-5" />
                </button>
                <button
                  type="button"
                  aria-label="Sljedeća slika"
                  onClick={() => step(1)}
                  className={`absolute top-1/2 right-3 -translate-y-1/2 sm:right-5 ${nav}`}
                >
                  <ChevronRight className="size-5" />
                </button>
              </>
            )}
          </div>
        )}
      </dialog>
    </>
  );
}
