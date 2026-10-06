import Image from "next/image";
import { quote, story } from "@/content/about";

export function Story() {
  return (
    <section className="px-5 py-24 lg:py-32">
      <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <div className="relative aspect-[4/5] overflow-hidden rounded-2xl">
            <Image
              src="/images/om-profil.jpg"
              alt="Portret Adnana Goste"
              fill
              sizes="(min-width: 1024px) 40vw, 100vw"
              className="object-cover"
            />
          </div>
        </div>
        <div>
          <h2 className="font-display text-6xl leading-[0.9] sm:text-7xl lg:text-8xl">
            Kako je
            <br />
            <span className="text-brand-yellow">sve počelo</span>
          </h2>
          <div className="mt-10 space-y-6 text-lg text-white/80">
            {story.map((p) => (
              <p key={p.slice(0, 24)}>{p}</p>
            ))}
          </div>
          <figure className="mt-14 border-l-4 border-brand-yellow pl-6 lg:pl-8">
            <blockquote className="font-display text-4xl leading-[1.05] lg:text-5xl">
              “{quote.text}”
            </blockquote>
            <figcaption className="mt-4 font-semibold text-brand-yellow">{quote.author}</figcaption>
          </figure>
        </div>
      </div>
    </section>
  );
}
