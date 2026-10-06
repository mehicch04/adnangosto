/*
  =========================================================
  SADRŽAJ SAJTA (privremeno u kodu)
  =========================================================
  Zamisli ovaj fajl kao "rezervni rezervoar".
  Paketi i transformacije se prvo traže u Supabase-u (lib/content.ts).
  Ako baza nije spojena ili je prazna, sajt crpi odavde i nikad ne pukne.

  Kad admin panel bude gotov, Adnan sve ovo mijenja sam, a ovaj fajl
  ostaje samo kao sigurnosna mreža.

  !!! Sve označeno sa PROVJERITI mora potvrditi Adnan prije objave.
  Činjenice o karijeri su uzete iz javne baze rezultata (Fitness Volt).
*/

// ---------------------------------------------------------------------
// Tipovi: isti oblik kao tabele u Supabase-u, da zamjena bude bezbolna
// ---------------------------------------------------------------------
export type Package = {
  slug: string;
  name: string;
  tagline: string | null;
  audience: string | null;
  duration: string | null;
  price_label: string | null;
  features: string[];
};

export type Transformation = {
  client_name: string;
  client_label: string | null;
  result: string | null;
  testimonial: string | null;
  before_image: string | null;
  after_image: string | null;
};

// ---------------------------------------------------------------------
// Osnovni podaci
// ---------------------------------------------------------------------
export const site = {
  name: "Adnan Gosto",
  // PROVJERITI: tačan Instagram profil
  instagram: "https://www.instagram.com/",
  instagramHandle: "@adnangosto",
};

// ---------------------------------------------------------------------
// Hero
// ---------------------------------------------------------------------
export const hero = {
  // kratka rečenica iznad naslova, bez velikih slova i tačkica
  kicker: "IFBB Pro i trener",
  title: "Od prvog treninga",
  titleAccent: "do bine.",
  subtitle:
    "Vodim takmičare kroz cijelu sezonu, pomažem rekreativcima da dođu u formu koja se zadrži i učim trenere kako da rade s ljudima. Izaberi način saradnje, popuni kratku prijavu i javljam ti se.",
  primaryCta: { label: "Izaberi saradnju", href: "#saradnja" },
  secondaryCta: { label: "Pogledaj rezultate", href: "#rezultati" },
};

// ---------------------------------------------------------------------
// Traka autoriteta ispod heroja (ideja s J3U: dokaz odmah na vrhu)
// PROVJERITI sve tri stavke s Adnanom
// ---------------------------------------------------------------------
export const credentials = [
  { value: "IFBB Pro", label: "Nastupi na IFBB Pro takmičenjima 2021. i 2022." },
  { value: "Od 2012.", label: "Takmičarska karijera, Balkansko prvenstvo i Amateur Olympia" },
  { value: "Sezona", label: "Takmičare vodi i prati na takmičenjima uživo" },
];

// ---------------------------------------------------------------------
// Paketi: rezerva ako Supabase nije spojen. Iste vrijednosti kao seed.sql
// PROVJERITI: 12 sedmica ili 3 mjeseca, i tačni nazivi
// ---------------------------------------------------------------------
export const fallbackPackages: Package[] = [
  {
    slug: "klasicni-coaching",
    name: "Klasični coaching",
    tagline: "Individualni plan treninga i ishrane uz redovne provjere.",
    audience: "Za one koji žele ozbiljan napredak uz stručno vodstvo",
    duration: "mjesečno",
    price_label: "na upit",
    features: [
      "Plan treninga po mjeri",
      "Plan ishrane",
      "Sedmične provjere",
      "Podrška kroz poruke",
    ],
  },
  {
    slug: "paket-12-sedmica",
    name: "Paket 12 sedmica",
    tagline: "Tri mjeseca fokusiranog rada s jasnim ciljem.",
    audience: "Za one koji žele vidljivu promjenu u zadanom roku",
    duration: "12 sedmica",
    price_label: "na upit",
    features: ["Početna procjena", "Plan po fazama", "Praćenje napretka", "Završna analiza"],
  },
  {
    slug: "edukacija-za-trenere",
    name: "Edukacija za trenere",
    tagline: "Znanje iz takmičarske prakse za trenere koji rade s klijentima.",
    audience: "Za trenere i one koji to žele postati",
    duration: "po dogovoru",
    price_label: "na upit",
    features: ["Priprema takmičara", "Planiranje ishrane", "Rad s klijentima"],
  },
];

// ---------------------------------------------------------------------
// Kako izgleda saradnja: stvarni redoslijed, zato je numerisan
// ---------------------------------------------------------------------
export const process = [
  {
    title: "Popuniš prijavu",
    text: "Izabereš paket i odgovoriš na nekoliko pitanja o cilju, iskustvu i treningu. Traje par minuta.",
  },
  {
    title: "Pregledam i javim se",
    text: "Pročitam tvoje odgovore i javim ti se s prijedlogom. Ne moraš ništa objašnjavati ispočetka.",
  },
  {
    title: "Dobiješ plan",
    text: "Trening i ishrana složeni za tebe, tvoj raspored i tvoj cilj, a ne prepisani šablon.",
  },
  {
    title: "Pratimo i prilagođavamo",
    text: "Redovne provjere napretka. Kad tijelo krene drugačije nego što smo planirali, plan se mijenja.",
  },
];

// ---------------------------------------------------------------------
// Transformacije: rezerva je prazna, sekcija tada crta okvire za slike
// ---------------------------------------------------------------------
export const fallbackTransformations: Transformation[] = [];

// ---------------------------------------------------------------------
// O meni. PROVJERITI cijeli tekst, ovo je nacrt iz javnih podataka
// ---------------------------------------------------------------------
export const about = {
  title: "Iskustvo s bine, ne iz knjige",
  paragraphs: [
    "Takmičim se od 2012. Prošao sam Balkansko prvenstvo, Amateur Olympiju i nastupio kao IFBB Pro. Svaku fazu, od offseasona do dana takmičenja, prošao sam na svojoj koži.",
    "Danas to znanje prenosim na ljude s kojima radim. Neki se spremaju za binu, neki žele formu koja se zadrži, a neki su treneri koji žele raditi bolje. Svakom pristupam drugačije, jer niko ne kreće s iste tačke.",
  ],
  highlights: [
    "IFBB Pro takmičar",
    "Priprema takmičara kroz cijelu sezonu",
    "Edukacija i seminari za trenere",
  ],
};

// ---------------------------------------------------------------------
// Sponzori: prazno dok ne stignu logotipi. Sekcija se tada ne prikazuje.
// ---------------------------------------------------------------------
export const sponsors: { name: string; logo: string; url?: string }[] = [];
