import { process } from "@/content/site";

export function Process() {
  return (
    <section
      id="kako-radimo"
      className="scroll-mt-16 border-t border-brand-line bg-brand-surface px-5 py-24 lg:py-32"
    >
      <div className="mx-auto max-w-7xl">
        <h2 className="max-w-3xl font-display text-6xl leading-[0.9] sm:text-7xl lg:text-8xl">
          Od prijave do <span className="text-brand-yellow">prvog plana</span>
        </h2>
        <ol className="mt-16 grid gap-12 sm:grid-cols-2 lg:grid-cols-4 lg:gap-0">
          {process.map((step, i) => (
            <li
              key={step.title}
              className="relative lg:border-l lg:border-brand-line lg:px-8 lg:first:border-l-0 lg:first:pl-0"
            >
              <span
                aria-hidden="true"
                className="text-outline block font-display text-8xl leading-none lg:text-9xl"
              >
                {i + 1}
              </span>
              <h3 className="mt-4 font-display text-3xl lg:text-4xl">{step.title}</h3>
              <p className="mt-2 text-brand-muted">{step.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
