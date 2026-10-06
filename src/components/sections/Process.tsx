/*
  KAKO RADIMO: četiri koraka od prijave do napretka.
  Ovo je stvaran redoslijed, zato su koraci numerisani.

  Ova sekcija odgovara na pitanja koja Adnan inače kuca u porukama
  svakom posebno ("kako to ide, šta dobijem, kad počinjemo").
*/
import { process } from "@/content/site";

export function Process() {
  return (
    <section
      id="kako-radimo"
      className="scroll-mt-20 border-y border-brand-line bg-brand-surface px-5 py-20 lg:py-28"
    >
      <div className="mx-auto max-w-6xl">
        <h2 className="max-w-2xl font-display text-5xl leading-none sm:text-6xl">
          Od prijave do prvog plana
        </h2>

        {/* <ol> jer je redoslijed bitan; čitač ekrana sam kaže "korak 1 od 4" */}
        <ol className="mt-12 grid gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          {process.map((step, index) => (
            <li key={step.title} className="relative">
              {/* Broj kao obris u žutoj: vidi se, a ne viče.
                  WebkitTextStroke crta samo ivicu slova. */}
              <span
                aria-hidden="true"
                className="block font-display text-7xl leading-none text-transparent"
                style={{ WebkitTextStroke: "1.5px #edb12d" }}
              >
                {index + 1}
              </span>
              <h3 className="mt-3 font-display text-3xl">{step.title}</h3>
              <p className="mt-2 text-brand-muted">{step.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
