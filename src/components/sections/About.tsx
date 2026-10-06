/*
  O MENI: lična priča u prvom licu. Adnan je jedan čovjek, ne institucija,
  i to je njegova prednost u odnosu na velike akademije poput J3U.
*/
import { CheckIcon } from "@/components/ui/icons";
import { about } from "@/content/site";

export function About() {
  return (
    <section id="o-meni" className="scroll-mt-20 border-t border-brand-line px-5 py-20 lg:py-28">
      <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
        <h2 className="font-display text-5xl leading-none sm:text-6xl">{about.title}</h2>

        <div>
          {about.paragraphs.map((p) => (
            <p key={p.slice(0, 20)} className="mb-5 text-lg text-brand-muted last:mb-0">
              {p}
            </p>
          ))}

          <ul className="mt-8 space-y-3">
            {about.highlights.map((h) => (
              <li key={h} className="flex items-center gap-3">
                <CheckIcon className="size-5 shrink-0 text-brand-yellow" />
                <span className="font-semibold">{h}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
