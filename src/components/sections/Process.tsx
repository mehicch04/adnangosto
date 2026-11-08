import type { ReactNode } from "react";
import { process } from "@/content/site";
import { formatPrice, packages } from "@/content/packages";
import { ArrowRightIcon, TickIcon } from "@/components/ui/icons";
import { ProcessCard } from "@/components/sections/ProcessCard";

const anim = "transition-all duration-700 ease-[cubic-bezier(.2,.75,.1,1)]";

function PackagesVisual() {
  return (
    <ul className="mx-auto max-w-sm space-y-2">
      {packages.map((p, i) => (
        <li
          key={p.slug}
          style={{ transitionDelay: `${i * 90}ms` }}
          className={`${anim} flex translate-x-6 items-center justify-between rounded-2xl border px-4 py-3 opacity-0 group-data-[in=true]:translate-x-0 group-data-[in=true]:opacity-100 ${
            i === 1
              ? "border-brand-yellow bg-brand-yellow text-brand-black"
              : "border-white/10 bg-black/40"
          }`}
        >
          <span className="font-semibold">{p.shortName}</span>
          <span
            className={`font-display text-2xl leading-none ${i === 1 ? "" : "text-brand-yellow"}`}
          >
            {formatPrice(p.price)}
          </span>
        </li>
      ))}
    </ul>
  );
}

function FormVisual() {
  const r = 34;
  const c = 2 * Math.PI * r;
  return (
    <div className="grid h-full items-center gap-6 sm:grid-cols-[auto_1fr]">
      <div className="relative mx-auto size-36">
        <svg viewBox="0 0 80 80" className="size-full -rotate-90" aria-hidden="true">
          <circle
            cx="40"
            cy="40"
            r={r}
            fill="none"
            stroke="rgba(255,255,255,0.1)"
            strokeWidth="6"
          />
          <circle
            cx="40"
            cy="40"
            r={r}
            fill="none"
            stroke="#edb12d"
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={c}
            className="transition-[stroke-dashoffset] duration-[1400ms] ease-out [stroke-dashoffset:var(--o)] group-data-[in=true]:[stroke-dashoffset:calc(var(--o)*0.25)]"
            style={{ ["--o" as string]: `${c}` }}
          />
        </svg>
        <span className="absolute inset-0 grid place-items-center text-center">
          <span>
            <span className="block font-display text-4xl leading-none">10</span>
            <span className="text-xs font-semibold text-white/55">minuta</span>
          </span>
        </span>
      </div>
      <div className="space-y-2.5">
        {[
          ["Cilj", "Skinuti masnoće, zadržati snagu"],
          ["Treninga sedmično", "4"],
          ["Posao i obaveze", "Smjene, treniram uveče"],
        ].map(([l, v], i) => (
          <div
            key={l}
            style={{ transitionDelay: `${200 + i * 120}ms` }}
            className={`${anim} translate-y-3 rounded-xl border border-white/10 bg-black/40 px-4 py-2.5 opacity-0 group-data-[in=true]:translate-y-0 group-data-[in=true]:opacity-100`}
          >
            <p className="text-[11px] font-semibold text-white/45">{l}</p>
            <p className="text-sm font-semibold">{v}</p>
          </div>
        ))}
        <div className="grid grid-cols-3 gap-2">
          {["Sprijeda", "Bočno", "Leđa"].map((t, i) => (
            <span
              key={t}
              style={{ transitionDelay: `${560 + i * 120}ms` }}
              className={`${anim} flex items-center justify-center gap-1.5 rounded-xl bg-white/10 py-2.5 text-xs font-semibold opacity-0 group-data-[in=true]:opacity-100`}
            >
              <TickIcon className="size-3.5 text-brand-yellow" />
              {t}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

function PlanVisual() {
  const week = [
    ["Pon", "Gornji dio", 90],
    ["Uto", "Donji dio", 80],
    ["Sri", "Odmor", 25],
    ["Čet", "Gornji dio", 90],
    ["Pet", "Donji dio", 80],
    ["Sub", "Kardio", 50],
    ["Ned", "Odmor", 25],
  ] as const;
  return (
    <div className="relative grid h-full items-center gap-6 sm:grid-cols-[auto_1fr]">
      <div className="relative mx-auto h-48 w-36 sm:mr-4">
        {["Plan prehrane", "Plan treninga"].map((t, i) => (
          <div
            key={t}
            className={`${anim} absolute inset-0 rounded-xl bg-[#f6f6f4] p-3 text-black shadow-[0_20px_40px_-20px_rgba(0,0,0,0.9)] ${
              i === 0
                ? "group-data-[in=true]:translate-x-3 group-data-[in=true]:rotate-6"
                : "group-data-[in=true]:-translate-x-3 group-data-[in=true]:-rotate-3"
            }`}
          >
            <span className="rounded bg-[#e5484d] px-1.5 py-0.5 text-[9px] font-bold text-white">
              PDF
            </span>
            <p className="mt-2 font-display text-lg leading-none">{t}</p>
            <div className="mt-3 space-y-1.5">
              {[90, 70, 80, 55, 75, 60].map((w, k) => (
                <span
                  key={k}
                  className="block h-1.5 rounded-full bg-black/10"
                  style={{ width: `${w}%` }}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
      <ul className="space-y-2 sm:pl-4">
        {week.map(([d, t, w], i) => (
          <li key={d} className="grid grid-cols-[2.5rem_1fr_6rem] items-center gap-3 text-sm">
            <span className="font-semibold text-white/45">{d}</span>
            <span className="h-2 overflow-hidden rounded-full bg-white/10">
              <span
                style={{ transitionDelay: `${i * 80}ms`, width: `${w}%` }}
                className={`${anim} block h-full origin-left scale-x-0 rounded-full group-data-[in=true]:scale-x-100 ${
                  t === "Odmor" ? "bg-white/30" : "bg-brand-yellow"
                }`}
              />
            </span>
            <span className="text-white/70">{t}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function CheckinVisual() {
  const pts = [
    [0, 18],
    [60, 30],
    [120, 34],
    [180, 50],
    [240, 58],
    [300, 72],
  ];
  const d = pts.map(([x, y], i) => `${i ? "L" : "M"}${x} ${y}`).join(" ");
  return (
    <div className="flex h-full flex-col justify-between gap-5">
      <div className="flex items-end justify-between">
        <span>
          <span className="block text-xs font-semibold text-white/50">Težina kroz check-inove</span>
          <span className="font-display text-5xl leading-none">−4,2 kg</span>
        </span>
        <span className="flex gap-1 rounded-full bg-black/40 p-1 text-xs font-semibold">
          <span className="rounded-full bg-brand-yellow px-2.5 py-1 text-brand-black">7 dana</span>
          <span className="px-2.5 py-1 text-white/60">4 sedmice</span>
        </span>
      </div>
      <svg viewBox="-6 0 312 84" className="w-full" aria-hidden="true">
        {[20, 45, 70].map((y) => (
          <line key={y} x1="0" x2="300" y1={y} y2={y} stroke="rgba(255,255,255,0.07)" />
        ))}
        <path
          d={d}
          fill="none"
          stroke="#edb12d"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          pathLength={1}
          strokeDasharray="1"
          className="transition-[stroke-dashoffset] duration-[1600ms] ease-out [stroke-dashoffset:1] group-data-[in=true]:[stroke-dashoffset:0]"
        />
        {pts.map(([x, y], i) => (
          <circle
            key={x}
            cx={x}
            cy={y}
            r="4.5"
            fill="#141414"
            stroke="#edb12d"
            strokeWidth="2.5"
            style={{ transitionDelay: `${300 + i * 220}ms` }}
            className="opacity-0 transition-opacity duration-300 group-data-[in=true]:opacity-100"
          />
        ))}
      </svg>
      <p className="rounded-2xl rounded-bl-sm bg-white px-4 py-3 text-sm font-semibold text-brand-black">
        Napredak je dobar. Ugljikohidrate dižemo za 20 g, kardio ostaje isti.
      </p>
    </div>
  );
}

const layout = ["lg:col-span-5", "lg:col-span-7", "lg:col-span-7", "lg:col-span-5"];
const visualsList: ReactNode[] = [
  <PackagesVisual key="paketi" />,
  <FormVisual key="upitnik" />,
  <PlanVisual key="plan" />,
  <CheckinVisual key="check-in" />,
];

export function Process() {
  return (
    <section id="kako-radimo" className="scroll-mt-24 px-5 py-24 lg:py-32">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
          <h2 className="font-display text-6xl leading-[0.88] sm:text-7xl lg:text-[7rem]">
            Od prijave do <span className="text-brand-yellow">plana</span>
          </h2>
          <div className="max-w-sm lg:pb-3">
            <p className="text-lg text-white/60">
              Bez dopisivanja i objašnjavanja ispočetka. Četiri koraka i znaš tačno gdje si.
            </p>
            <a
              href="#saradnja"
              className="mt-4 inline-flex min-h-11 items-center gap-2 font-bold text-brand-yellow transition-colors hover:text-white"
            >
              Kreni s prvim korakom
              <ArrowRightIcon />
            </a>
          </div>
        </div>
        <ol className="mt-12 grid gap-4 lg:grid-cols-12">
          {process.map((s, i) => (
            <ProcessCard key={s.title} className={layout[i]}>
              <div
                aria-hidden="true"
                className="relative min-h-60 flex-1 overflow-hidden bg-[radial-gradient(120%_90%_at_50%_0%,rgba(237,177,45,0.10),transparent_60%)] p-6 lg:p-8"
              >
                {visualsList[i]}
              </div>
              <div className="flex items-start gap-4 border-t border-white/10 p-6 lg:p-8">
                <span className="grid size-11 shrink-0 place-items-center rounded-full bg-brand-yellow font-display text-2xl leading-none text-brand-black">
                  {i + 1}
                </span>
                <div>
                  <h3 className="font-display text-4xl leading-none lg:text-[2.75rem]">
                    {s.title}
                  </h3>
                  <p className="mt-2 max-w-md text-white/60">{s.text}</p>
                </div>
              </div>
            </ProcessCard>
          ))}
        </ol>
      </div>
    </section>
  );
}
