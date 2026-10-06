import Image from "next/image";
import { gallery } from "@/content/about";

const spans = [
  "lg:col-span-2 lg:row-span-2",
  "lg:col-span-2",
  "",
  "",
  "lg:row-span-2",
  "lg:col-span-2 lg:row-span-2",
  "lg:row-span-2",
];

export function Gallery() {
  return (
    <section className="border-t border-brand-line px-5 py-24 lg:py-32">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h2 className="font-display text-6xl leading-[0.9] sm:text-7xl lg:text-8xl">Galerija</h2>
          <p className="text-sm text-brand-muted">Fotografije: Bille Art</p>
        </div>
        <ul className="mt-12 grid auto-rows-[220px] grid-cols-2 gap-3 lg:auto-rows-[260px] lg:grid-cols-4 lg:gap-4">
          {gallery.map((g, i) => (
            <li
              key={g.src}
              className={`group relative overflow-hidden rounded-xl bg-brand-surface ${spans[i] ?? ""} ${
                i === 0 ? "col-span-2 row-span-2" : ""
              }`}
            >
              <Image
                src={g.src}
                alt={g.alt}
                fill
                sizes="(min-width: 1024px) 50vw, 50vw"
                className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-brand-black/0 transition-colors duration-500 group-hover:bg-brand-black/20" />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
