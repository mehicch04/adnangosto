import { stats } from "@/content/site";

export function Stats() {
  return (
    <section aria-label="Karijera u brojkama" className="px-5 pt-6 pb-16 lg:pb-24">
      <dl className="mx-auto grid max-w-7xl grid-cols-2 gap-px overflow-hidden rounded-2xl bg-brand-line lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="bg-brand-black p-6 lg:p-10">
            <dt className="font-display text-6xl leading-none text-brand-yellow lg:text-8xl">
              {s.value}
            </dt>
            <dd className="mt-3 text-sm text-brand-muted lg:text-base">{s.label}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
