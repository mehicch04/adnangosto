import { marquee } from "@/content/site";

function Row({ hidden }: { hidden?: boolean }) {
  return (
    <ul aria-hidden={hidden} className="flex shrink-0 items-center">
      {marquee.map((item) => (
        <li
          key={item}
          className="flex items-center font-display text-3xl whitespace-nowrap lg:text-5xl"
        >
          <span className="px-6 lg:px-10">{item}</span>
          <span aria-hidden="true" className="text-brand-black/40">
            /
          </span>
        </li>
      ))}
    </ul>
  );
}

export function Marquee() {
  return (
    <section
      aria-label="Takmičenja"
      className="-rotate-1 overflow-hidden border-y-4 border-brand-black bg-brand-yellow py-4 text-brand-black lg:py-6"
    >
      <div className="flex w-max animate-marquee hover:[animation-play-state:paused]">
        <Row />
        <Row hidden />
      </div>
    </section>
  );
}
