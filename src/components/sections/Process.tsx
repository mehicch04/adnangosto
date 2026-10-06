import { process } from "@/content/site";

export function Process() {
  return (
    <section id="kako-radimo" className="scroll-mt-24 px-5 py-24 lg:py-32">
      <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <h2 className="font-display text-6xl leading-[0.88] sm:text-7xl lg:text-[7.5rem]">
            Od prijave
            <br />
            do <span className="text-brand-yellow">plana</span>
          </h2>
          <p className="mt-6 max-w-sm text-lg text-brand-muted">
            Bez dopisivanja i objašnjavanja ispočetka. Četiri koraka i znaš tačno gdje si.
          </p>
        </div>
        <ol className="border-t border-brand-line">
          {process.map((step, i) => (
            <li
              key={step.title}
              className="group grid grid-cols-[4rem_1fr] gap-4 border-b border-brand-line py-8 lg:grid-cols-[6rem_1fr] lg:py-10"
            >
              <span
                aria-hidden="true"
                className="font-display text-5xl leading-none text-brand-yellow lg:text-7xl"
              >
                0{i + 1}
              </span>
              <div>
                <h3 className="font-display text-4xl leading-none lg:text-5xl">{step.title}</h3>
                <p className="mt-3 max-w-md text-brand-muted">{step.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
