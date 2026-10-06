/*
  Traka autoriteta odmah ispod heroja (ideja s J3U: dokaz prije prodaje).
  Tri činjenice, velika vrijednost i kratko objašnjenje.
  Na mobitelu jedna ispod druge, na desktopu u redu s tankim razdjelnicima.
*/
import { credentials } from "@/content/site";

export function Credentials() {
  return (
    <section aria-label="Iskustvo" className="border-y border-brand-line">
      <dl className="mx-auto grid max-w-6xl divide-y divide-brand-line px-5 md:grid-cols-3 md:divide-x md:divide-y-0">
        {credentials.map((item) => (
          <div key={item.value} className="py-6 md:px-8 md:first:pl-0 md:last:pr-0">
            {/* dt/dd: semantički par "pojam i objašnjenje", čitači ekrana ga razumiju */}
            <dt className="font-display text-4xl text-brand-yellow">{item.value}</dt>
            <dd className="mt-1 text-sm text-brand-muted">{item.label}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
