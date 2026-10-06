/*
  HERO, prva sekcija. Za 5 sekundi mora reci: ko je, sta radi, gdje se klikne.
  KOSTUR: tekst ce dolaziti iz site_content, slika iz Storage-a (sedmica 3).
*/
export function Hero() {
  return (
    <section className="flex min-h-[80svh] items-center px-5 py-20">
      <div className="mx-auto w-full max-w-6xl">
        <h1 className="font-display text-6xl leading-none uppercase sm:text-8xl">
          Kako doći <span className="text-brand-yellow">do forme</span>
        </h1>
        <p className="mt-6 max-w-xl text-lg text-brand-muted">
          Coaching, priprema takmičara i edukacija za trenere.
        </p>
        {/* Zuto dugme, CRN tekst. Nikad bijeli tekst na zutom (kontrast 1.9:1). */}
        <a
          href="#usluge"
          className="mt-10 inline-block rounded-md bg-brand-yellow px-7 py-4 font-semibold text-brand-black"
        >
          Prijavi se
        </a>
      </div>
    </section>
  );
}
