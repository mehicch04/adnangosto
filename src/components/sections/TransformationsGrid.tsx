import Image from "next/image";

type Photo = { src: string; alt: string };

function Track({ photos, hidden }: { photos: Photo[]; hidden?: boolean }) {
  return (
    <ul aria-hidden={hidden} className="flex shrink-0 gap-4 pr-4">
      {photos.map((p) => (
        <li key={p.src} className="w-[78vw] shrink-0 sm:w-[360px] lg:w-[420px]">
          <figure className="relative overflow-hidden rounded-lg bg-brand-paper-line shadow-[0_20px_40px_-24px_rgba(10,10,10,0.45)]">
            <Image
              src={p.src}
              alt={hidden ? "" : p.alt}
              width={720}
              height={720}
              sizes="(min-width: 1024px) 420px, (min-width: 640px) 360px, 78vw"
              className="aspect-square w-full object-cover"
            />
            <span className="absolute top-3 left-3 rounded-sm bg-brand-black/80 px-2.5 py-1 text-[11px] font-bold tracking-[0.16em] text-white uppercase">
              Prije
            </span>
            <span className="absolute top-3 right-3 rounded-sm bg-brand-yellow px-2.5 py-1 text-[11px] font-bold tracking-[0.16em] text-brand-black uppercase">
              Poslije
            </span>
          </figure>
        </li>
      ))}
    </ul>
  );
}

export function TransformationsGrid({ photos }: { photos: Photo[] }) {
  return (
    <div
      role="region"
      aria-label="Transformacije klijenata, prije i poslije"
      className="mt-12 overflow-hidden lg:mt-16"
    >
      <div className="flex w-max animate-marquee will-change-transform [animation-duration:90s] [backface-visibility:hidden]">
        <Track photos={photos} />
        <Track photos={photos} hidden />
      </div>
    </div>
  );
}
