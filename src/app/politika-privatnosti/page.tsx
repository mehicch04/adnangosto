import type { Metadata } from "next";
import { PageShell } from "@/components/layout/PageShell";
import { ADNAN_EMAIL } from "@/content/packages";

export const metadata: Metadata = {
  title: "Politika privatnosti",
  description: "Kako se obrađuju podaci i fotografije poslani kroz prijavu na adnangosto.com.",
  alternates: { canonical: "/politika-privatnosti" },
};

const updated = "8. novembra 2026.";

const sections: { id: string; title: string; body: React.ReactNode }[] = [
  {
    id: "ko",
    title: "Ko obrađuje tvoje podatke",
    body: (
      <p>
        Voditelj obrade podataka je Adnan Gosto. Za sva pitanja o tvojim podacima piši na{" "}
        <a href={`mailto:${ADNAN_EMAIL}`}>{ADNAN_EMAIL}</a>.
      </p>
    ),
  },
  {
    id: "podaci",
    title: "Koje podatke prikupljam",
    body: (
      <>
        <p>Kad popuniš prijavu za neki od paketa, šalješ:</p>
        <ul>
          <li>
            ime i prezime, e-mail, telefon i Instagram ako ih upišeš, državu iz koje ide uplata
          </li>
          <li>jutarnju kilažu, ciljeve, trenutni plan treninga, prehranu i suplementaciju</li>
          <li>dnevnu rutinu i, kod takmičara, podatke o takmičenju i iskustvu</li>
          <li>zdravstveno stanje i podatak o korištenju AAS-a, ako ga navedeš</li>
          <li>fotografije tijela koje sam dodaš</li>
        </ul>
        <p>
          Podaci o zdravlju i fotografije tijela spadaju u posebno osjetljive podatke. Zato ih
          obrađujem samo uz tvoju izričitu saglasnost, koju daješ označavanjem kvačice prije slanja
          prijave.
        </p>
      </>
    ),
  },
  {
    id: "svrha",
    title: "Zašto ih obrađujem",
    body: (
      <>
        <p>
          Podatke koristim isključivo da procijenim tvoje stanje, javim ti se s dogovorom o saradnji
          i složim plan treninga i prehrane. Ne koristim ih za reklame, ne prodajem ih i ne dijelim
          ih s trećim osobama radi marketinga.
        </p>
        <p>
          Pravni osnov je tvoja saglasnost (član 6. stav 1. tačka a i član 9. stav 2. tačka a Opće
          uredbe o zaštiti podataka, GDPR) i radnje koje poduzimam na tvoj zahtjev prije sklapanja
          saradnje (član 6. stav 1. tačka b).
        </p>
      </>
    ),
  },
  {
    id: "pristup",
    title: "Ko ima pristup",
    body: (
      <>
        <p>
          Prijave i fotografije vidim samo ja, kroz zaštićeni panel s lozinkom. Fotografije nisu
          javne i ne mogu se otvoriti bez pristupa panelu ili privremenog linka koji važi ograničeno
          vrijeme.
        </p>
        <p>Za rad stranice koristim provjerene pružaoce usluga:</p>
        <ul>
          <li>Supabase, za bazu podataka i čuvanje fotografija, na serverima u Evropskoj uniji</li>
          <li>Vercel, za hosting stranice</li>
          <li>Resend, za slanje e-mailova o prijavi</li>
        </ul>
        <p>
          Ako neki od njih podatke obrađuje izvan Evropske unije, to se radi uz standardne ugovorne
          klauzule koje odobrava Evropska komisija.
        </p>
      </>
    ),
  },
  {
    id: "rok",
    title: "Koliko dugo ih čuvam",
    body: (
      <>
        <p>
          Ako saradnja ne počne, prijavu i fotografije brišem najkasnije 6 mjeseci nakon prijave.
          Tokom saradnje podatke čuvam dok saradnja traje, a nakon toga najviše 2 godine, osim ako
          zakon za neke podatke, poput računa, ne traži duže čuvanje.
        </p>
        <p>Brisanje možeš tražiti i ranije, u bilo kojem trenutku.</p>
      </>
    ),
  },
  {
    id: "prava",
    title: "Tvoja prava",
    body: (
      <>
        <p>U svakom trenutku možeš tražiti:</p>
        <ul>
          <li>uvid u podatke koje imam o tebi</li>
          <li>ispravku netačnih podataka</li>
          <li>brisanje podataka i fotografija</li>
          <li>ograničenje obrade ili kopiju podataka u uobičajenom formatu</li>
          <li>povlačenje saglasnosti, bez uticaja na obradu prije povlačenja</li>
        </ul>
        <p>
          Zahtjev pošalji na <a href={`mailto:${ADNAN_EMAIL}`}>{ADNAN_EMAIL}</a> i odgovaram u roku
          od 30 dana. Ako smatraš da su ti prava povrijeđena, možeš podnijeti prigovor nadležnom
          tijelu za zaštitu podataka, u Hrvatskoj je to Agencija za zaštitu osobnih podataka (AZOP),
          a u Bosni i Hercegovini Agencija za zaštitu ličnih podataka.
        </p>
      </>
    ),
  },
  {
    id: "kolacici",
    title: "Kolačići i lokalna pohrana",
    body: (
      <>
        <p>
          Stranica ne koristi kolačiće za praćenje, analitiku ni reklame. Koriste se samo nužni
          kolačići za prijavu u administratorski panel.
        </p>
        <p>
          Dok popunjavaš upitnik, odgovori se privremeno čuvaju u pregledniku na tvom uređaju, da ne
          izgubiš napredak ako zatvoriš stranicu. Fotografije se ne čuvaju na uređaju. Ti podaci se
          brišu čim pošalješ prijavu, a sam ih možeš obrisati brisanjem podataka preglednika.
        </p>
        <p>
          Objave s Instagrama prikazane na stranici učitavaju se preko servisa Behold, koji pri tome
          može vidjeti tehničke podatke poput IP adrese.
        </p>
      </>
    ),
  },
  {
    id: "izmjene",
    title: "Izmjene politike",
    body: (
      <p>
        Ako se način obrade promijeni, ova stranica se ažurira. Datum zadnje izmjene je naveden na
        vrhu.
      </p>
    ),
  },
];

export default function PrivacyPage() {
  return (
    <PageShell>
      <section className="px-5 pt-32 pb-24 lg:pt-44 lg:pb-32">
        <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[16rem_1fr] lg:gap-16">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <h1 className="font-display text-6xl leading-[0.88] sm:text-7xl">
              Politika
              <br />
              privatnosti
            </h1>
            <p className="mt-4 text-sm text-white/55">Zadnja izmjena: {updated}</p>
            <nav aria-label="Sadržaj" className="mt-8 hidden lg:block">
              <ol className="space-y-2 text-sm">
                {sections.map((s, i) => (
                  <li key={s.id}>
                    <a
                      href={`#${s.id}`}
                      className="text-white/60 transition-colors hover:text-white"
                    >
                      {i + 1}. {s.title}
                    </a>
                  </li>
                ))}
              </ol>
            </nav>
          </div>
          <div className="max-w-2xl">
            <p className="text-xl leading-relaxed text-white/85">
              Kroz prijavu mi šalješ lične podatke i fotografije. Ovdje je jednostavno objašnjeno
              šta s njima radim, ko ih vidi i kako ih možeš obrisati.
            </p>
            {sections.map((s, i) => (
              <section
                key={s.id}
                id={s.id}
                className="mt-12 scroll-mt-28 border-t border-brand-line pt-8 text-white/75 [&_a]:font-semibold [&_a]:text-brand-yellow [&_a]:underline [&_a]:underline-offset-4 [&_li]:mt-2 [&_p]:mt-4 [&_p]:leading-relaxed [&_ul]:mt-4 [&_ul]:list-disc [&_ul]:space-y-1 [&_ul]:pl-5"
              >
                <h2 className="font-display text-4xl leading-none text-white">
                  <span className="text-brand-yellow">{i + 1}.</span> {s.title}
                </h2>
                {s.body}
              </section>
            ))}
          </div>
        </div>
      </section>
    </PageShell>
  );
}
