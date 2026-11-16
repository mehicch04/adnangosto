export type PackageSlug =
  "online-coaching" | "paket-12-tjedana" | "coaching-i-edukacija" | "natjecateljske-pripreme";

export type PackageFaq = { q: string; a: string };

export type CoachingPackage = {
  slug: PackageSlug;
  name: string;
  shortName: string;
  badge?: string;
  featured?: boolean;
  tagline: string;
  audience: string;
  price: number;
  anchorPrice: number;
  priceUnit: string;
  priceNote: string;
  checkIn: string;
  billing: string;
  cardFeatures: string[];
  intro: string[];
  forWho: string[];
  includes: { title: string; text: string }[];
  steps: { title: string; text: string }[];
  why?: { title: string; paragraphs: string[] };
  notes: string[];
  faq: PackageFaq[];
  image: string;
};

export type PackageCompare = {
  tag: string;
  bestFor: string;
  payment: string;
  tracking: string;
  duration: string;
  edge: string;
};

export const packageCompare: Record<PackageSlug, PackageCompare> = {
  "online-coaching": {
    tag: "Tjedno praćenje",
    bestFor: "Imaš jasan cilj i želiš da netko prati svaki tvoj korak",
    payment: "Mjesečno",
    tracking: "Check-in svakih 7 dana, dan biraš sam",
    duration: "Mjesec po mjesec, sve do cilja",
    edge: "Plan se mijenja čim tijelo krene drugačije",
  },
  "paket-12-tjedana": {
    tag: "Bez pritiska",
    bestFor: "Početnici i srednje iskusni koji žele rezultat bez odricanja od svega",
    payment: "Jednom unaprijed, za sva 3 mjeseca",
    tracking: "Check-in svaka 4 tjedna, ukupno 3, putem e-maila",
    duration: "12 tjedana, zatim produžiš ili prijeđeš na online coaching",
    edge: "Plan složen oko navika kojih se ne želiš odreći",
  },
  "coaching-i-edukacija": {
    tag: "Za trenere",
    bestFor: "Treneri i iskusniji vježbači koji žele razumjeti cijeli proces",
    payment: "Mjesečno, coaching i edukacija u istoj cijeni",
    tracking: "Redoviti check-in, svaki je ujedno i lekcija",
    duration: "Cijeli proces, dok ne naučiš raditi samostalno",
    edge: "Radimo na tebi ili na tvom klijentu, uz objašnjenje svake odluke",
  },
  "natjecateljske-pripreme": {
    tag: "Za natjecatelje",
    bestFor: "Natjecatelji, od prvog nastupa do pro karte",
    payment: "Mjesečno",
    tracking: "Plan se vodi tjedan po tjedan, sve do završnice",
    duration: "Do dana natjecanja, priprema traje najmanje 3 mjeseca",
    edge: "Završnica pred nastup i pomoć oko pozinga po dogovoru",
  },
};

export const ADNAN_EMAIL = "adnan.adoni.gosto@gmail.com";

export const PRICE_ANCHOR_LABEL = "Cijena na dan 15. 9. 2025.";

export const PRICE_VAT_NOTE = "Sve cijene su s PDV-om.";

export const packages: CoachingPackage[] = [
  {
    slug: "online-coaching",
    name: "Online coaching",
    shortName: "Online coaching",
    tagline: "Klasični online coaching uz tjedni check-in i stalno prilagođavanje plana.",
    audience: "Za one koji žele redovito praćenje i plan koji se mijenja zajedno s njima.",
    price: 180,
    anchorPrice: 180,
    priceUnit: "mjesečno",
    priceNote: "Plaća se mjesečno",
    checkIn: "Check-in svakih 7 dana",
    billing: "mjesečno",
    cardFeatures: [
      "Početni plan treninga i prehrane prema upitniku",
      "Check-in i izmjene svakih 7 dana",
      "Dostupan za pitanja između check-inova",
    ],
    intro: [
      "Klasičan oblik online coachinga. Svaki tjedan šalješ check-in, ja pratim napredak i prilagođavam sve parametre tvojim potrebama i mogućnostima.",
      "Sve kreće od upitnika koji mi daje precizan uvid u tvoje stanje, mogućnosti i ciljeve. Prema njemu slažem početni plan, a zatim ga doradim sa svakim check-inom.",
    ],
    forWho: [
      "Želiš da netko prati svaki tvoj korak i reagira na vrijeme",
      "Imaš jasan cilj i spreman si raditi tjedan po tjedan",
      "Želiš plan koji se mijenja kako se mijenja tvoje tijelo",
    ],
    includes: [
      {
        title: "Upitnik i početni plan",
        text: "Detaljan upitnik o tvom stanju, rutini i ciljevima, a zatim plan treninga i prehrane složen prema njemu.",
      },
      {
        title: "Check-in svakih 7 dana",
        text: "Šalješ slike i podatke, a ja na temelju njih postavljam sve parametre za sljedeći tjedan.",
      },
      {
        title: "Stalna prilagodba",
        text: "Trening, prehrana i suplementacija mijenjaju se kad tijelo krene drugačije od plana.",
      },
      {
        title: "Pitanja između check-inova",
        text: "Radnim danima sam na raspolaganju za sva pitanja vezana uz sam proces.",
      },
    ],
    steps: [
      {
        title: "Ispuniš upitnik",
        text: "Odgovoriš na pitanja i pošalješ slike. Tako odmah vidim cijelu situaciju.",
      },
      {
        title: "Dobiješ početni plan",
        text: "Trening i prehrana složeni prema tvojoj rutini, mogućnostima i cilju.",
      },
      {
        title: "Check-in svaki tjedan",
        text: "Dan biraš sam. Nije važno je li ponedjeljak ili četvrtak, važno je da si redovit.",
      },
      {
        title: "Izmjene i napredak",
        text: "Nakon svakog check-ina dobiješ upute za sljedeći tjedan, sve do cilja.",
      },
    ],
    notes: [
      "Vikendom ne radim. Izmjene radim od ponedjeljka, redom kako su check-inovi stizali od subote.",
      "Ako check-in pošalješ u ponedjeljak ujutro, može se dogoditi da odgovor stigne dan kasnije. Trenutni plan i dalje daje rezultate.",
      "Tvoj je zadatak biti redovit. Razmak od 7 do 10 dana između check-inova potpuno je u redu.",
    ],
    faq: [
      {
        q: "Koji dan šaljem check-in?",
        a: "Nema određenog dana. Šalješ ga kad ti odgovara, samo neka razmak bude otprilike 7 dana. I 7 do 10 dana je u redu.",
      },
      {
        q: "Što ako zakasnim s check-inom par dana?",
        a: "Ništa strašno. Nije važno je li check-in poslan isti dan kao prošli tjedan ili 2 do 3 dana kasnije. Važno je da si redovit.",
      },
      {
        q: "Odgovaraš li vikendom?",
        a: "Ne. Vikendom uglavnom nisam dostupan. Od ponedjeljka radim izmjene redom kako su check-inovi stizali.",
      },
    ],
    image: "/images/om-ledja.jpg",
  },
  {
    slug: "paket-12-tjedana",
    name: "Paket 12 tjedana",
    shortName: "12 tjedana",
    badge: "Za početnike",
    tagline: "Napredak bez pritiska. Plan koji se uklapa u tvoj život, a ne obrnuto.",
    audience: "Za početnike i srednje iskusne koji žele rezultat bez spartanskog pristupa.",
    price: 380,
    anchorPrice: 380,
    priceUnit: "za 12 tjedana",
    priceNote: "Plaća se jednom unaprijed, za sva 3 mjeseca",
    checkIn: "Check-in svaka 4 tjedna",
    billing: "jednokratno",
    cardFeatures: [
      "Početni plan treninga i prehrane prema upitniku",
      "3 check-ina, svaka 4 tjedna, putem e-maila",
      "Bez odricanja od svega i bez spartanskog režima",
    ],
    intro: [
      "Početak je isti kao kod online coachinga. Ispuniš upitnik, a ja prema tvojoj situaciji složim polazni plan.",
      "Check-in je svaka 4 tjedna, što znači 3 check-ina tijekom jednog bloka od 12 tjedana. Sve ide putem e-maila. Nakon 12 tjedana možeš produžiti na isti način ili prijeći na online coaching.",
    ],
    forWho: [
      "Želiš napredak, ali ne želiš pratiti program iz dana u dan",
      "Ne želiš se odreći društvenog života i svega što voliš",
      "Imaš višak kilograma, manjak kilograma ili samo želiš izgraditi mišiće bez žurbe",
      "Želiš manje treninga tjedno, a da i dalje vidiš rezultat",
    ],
    includes: [
      {
        title: "Upitnik i polazni plan",
        text: "Plan treninga i prehrane složen prema tvom stanju, rutini i navikama kojih se ne želiš odreći.",
      },
      {
        title: "3 check-ina u 12 tjedana",
        text: "Svaka 4 tjedna šalješ check-in, a ja prilagodim plan za sljedeće razdoblje.",
      },
      {
        title: "Tempo koji sam biraš",
        text: "Sustav radi onoliko koliko mu se posvetiš. Može donijeti male pomake ili iznadprosječnu transformaciju.",
      },
      {
        title: "Nastavak po želji",
        text: "Nakon 12 tjedana produžiš isti paket ili prijeđeš na online coaching s tjednim check-inom.",
      },
    ],
    steps: [
      {
        title: "Ispuniš upitnik",
        text: "Navedeš i navike kojih se ne želiš odreći te što točno očekuješ od ovih 12 tjedana.",
      },
      {
        title: "Dobiješ polazni plan",
        text: "Plan je složen tako da se uklopi u tvoj posao, obveze i slobodno vrijeme.",
      },
      {
        title: "Check-in svaka 4 tjedna",
        text: "Ukupno 3 check-ina putem e-maila. Između njih radiš po planu svojim tempom.",
      },
      {
        title: "Produžiš ili nastaviš dalje",
        text: "Nakon 12 tjedana biraš novi blok ili prelazak na online coaching.",
      },
    ],
    why: {
      title: "Zašto check-in samo svaka 4 tjedna?",
      paragraphs: [
        "Petnaest godina rada s ljudima pokazalo je da više od polovice rekreativaca želi napredak i rezultat, ali ne želi strogo praćenje programa iz dana u dan, stalna ograničenja i propuštanje društvenog života.",
        "Ljudi godinama dolaze u teretanu i izgledaju isto. Da su svakih mjesec ili dva imali i najmanji napredak, za dvije godine imali bi drugo tijelo. Ovaj paket je kompromis između cijene i utrošenog vremena, za isti cilj.",
        "Program je onoliko učinkovit koliko ga ti učiniš učinkovitim. Može se postići i vrhunski rezultat, ali je prije svega osmišljen za one koji ne postavljaju ljestvicu visoko.",
      ],
    },
    notes: [
      "Cijena pokriva sva 3 mjeseca i plaća se jednom, unaprijed.",
      "Komunikacija i check-in idu isključivo putem e-maila.",
    ],
    faq: [
      {
        q: "Je li ovaj paket samo za početnike?",
        a: "Napravljen je za početnike i srednje iskusne, ali i za sve koji žele napredak bez velikog pritiska. Isti sustav može donijeti i iznadprosječnu transformaciju, ovisno o tome koliko mu se posvetiš.",
      },
      {
        q: "Što nakon 12 tjedana?",
        a: "Možeš produžiti suradnju na isti način ili prijeći na online coaching s check-inom svakih 7 dana.",
      },
      {
        q: "Moram li se odreći izlazaka i hrane koju volim?",
        a: "Ne. U upitniku navedeš navike kojih se ne želiš odreći i plan se slaže oko njih.",
      },
    ],
    image: "/images/om-majica.jpg",
  },
  {
    slug: "coaching-i-edukacija",
    name: "Coaching i edukacija",
    shortName: "Coaching i edukacija",
    tagline: "Učiš kroz praksu, na stvarnoj transformaciji, korak po korak.",
    audience: "Za trenere i iskusnije vježbače koji žele razumjeti cijeli proces.",
    price: 350,
    anchorPrice: 350,
    priceUnit: "mjesečno",
    priceNote: "Coaching i edukacija u istoj cijeni",
    checkIn: "Proces vodimo zajedno",
    billing: "mjesečno",
    cardFeatures: [
      "Kompletan coaching proces i edukacija u jednom",
      "Radimo na tebi ili na tvom klijentu",
      "Svaka odluka objašnjena do detalja",
    ],
    intro: [
      "Ovaj oblik suradnje je za one koji žele naučiti kako proces zaista funkcionira ili unaprijediti svoje znanje u radu s klijentima.",
      "Teorija bez prakse ne vrijedi mnogo. Zato zajedno prolazimo kroz tvoju transformaciju ili zajedno vodimo jednog od tvojih klijenata, na kojem ti detaljno objašnjavam cijeli proces.",
    ],
    forWho: [
      "Trener si i želiš bolje rezultate sa svojim klijentima",
      "Iskusniji si vježbač i želiš razumjeti zašto se nešto radi",
      "Želiš naučiti kako se rješava stagnacija u procesu",
    ],
    includes: [
      {
        title: "Coaching kroz cijeli proces",
        text: "Transformacija tebe ili tvog klijenta, s planom treninga i prehrane i redovitim izmjenama.",
      },
      {
        title: "Objašnjenje svakog koraka",
        text: "Za svaku izmjenu znaš zašto se radi, kako se donosi odluka i što se očekuje.",
      },
      {
        title: "Rješavanje stagnacije",
        text: "Kroz stvarne situacije pokazujem kako se prepoznaje i rješava zastoj u napretku.",
      },
      {
        title: "Pitanja kad god zatrebaju",
        text: "Na raspolaganju sam i za sva dodatna pitanja vezana uz trening i prehranu.",
      },
    ],
    steps: [
      {
        title: "Biraš na kome radimo",
        text: "Na tebi ili na tvom klijentu. U upitniku navedeš i što te više zanima, trening ili prehrana.",
      },
      {
        title: "Postavljamo početni plan",
        text: "Prolazim s tobom kroz svaki parametar i objašnjavam zašto je postavljen baš tako.",
      },
      {
        title: "Vodimo proces zajedno",
        text: "Svaki check-in je ujedno i lekcija. Vidiš kako se odluke donose na stvarnim podacima.",
      },
      {
        title: "Znanje ostaje tebi",
        text: "Nakon procesa znaš raditi samostalno, sa sobom i sa svojim klijentima.",
      },
    ],
    why: {
      title: "Znanje iz prakse, ne iz knjige",
      paragraphs: [
        "Radio sam s nekima od najboljih trenera na svijetu i nakon svakog procesa moj se pristup mijenjao. Ne zato što sam kopirao tuđe, nego zato što mi se mijenjao način razmišljanja i rješavanja problema.",
        "Od 2024. predajem i na Fitnes učilištu u Zagrebu. Isto iskustvo prenosim i ovdje, samo na tvom konkretnom primjeru.",
      ],
    },
    notes: ["Cijena uključuje coaching, odnosno proces transformacije, i edukaciju."],
    faq: [
      {
        q: "Mogu li raditi na svom klijentu umjesto na sebi?",
        a: "Možeš. Zajedno vodimo jednog od tvojih klijenata i na njemu ti objašnjavam cijeli proces rada.",
      },
      {
        q: "Što ako me više zanima prehrana nego trening?",
        a: "U upitniku označiš segment koji ti je važniji i fokus edukacije stavljamo na njega.",
      },
    ],
    image: "/images/om-portret.jpg",
  },
  {
    slug: "natjecateljske-pripreme",
    name: "Natjecateljske pripreme",
    shortName: "Natjecateljske pripreme",
    tagline:
      "Priprema za natjecanje od trenera čiji su natjecatelji osvojili sve u amaterskom bodybuildingu.",
    audience: "Za natjecatelje, od prvog nastupa do pro karte.",
    price: 220,
    anchorPrice: 220,
    priceUnit: "mjesečno",
    priceNote: "Plaća se mjesečno",
    checkIn: "Plan do dana natjecanja",
    billing: "mjesečno",
    cardFeatures: [
      "Priprema za konkretno natjecanje i datum",
      "Trening, prehrana i završnica pred nastup",
      "Pomoć oko pozinga po dogovoru",
    ],
    intro: [
      "Kao trener, sa svojim natjecateljima osvojio sam sve što se u amaterskom bodybuildingu moglo osvojiti, od državnih prvenstava do svjetskog prvenstva, Arnold Classica i pro karata.",
      "Pripremu slažemo prema datumu natjecanja i točnom broju tjedana koje imamo na raspolaganju.",
    ],
    forWho: [
      "Spremaš se za prvo natjecanje i želiš ga odraditi kako treba",
      "Već nastupaš i želiš podići formu na višu razinu",
      "Ciljaš međunarodna natjecanja i pro kartu",
    ],
    includes: [
      {
        title: "Plan za cijelu pripremu",
        text: "Trening, prehrana i suplementacija složeni prema datumu nastupa i tvom iskustvu.",
      },
      {
        title: "Završnica do detalja",
        text: "Zadnji tjedni i dani pred nastup, gdje se priprema dobiva ili gubi.",
      },
      {
        title: "Pozing po dogovoru",
        text: "Ako ti treba pomoć oko pozinga, navedeš to u upitniku pa se dogovorimo.",
      },
      {
        title: "Iskustvo s velikih pozornica",
        text: "Arnold Classic, svjetsko i europsko prvenstvo, četiri pro karte s natjecateljima.",
      },
    ],
    steps: [
      {
        title: "Navedeš datum natjecanja",
        text: "U upitniku upišeš natjecanje, datum i dosadašnje iskustvo na pozornici.",
      },
      {
        title: "Procjena forme",
        text: "Prema slikama i podacima procijenim gdje si i koliko vremena realno treba.",
      },
      {
        title: "Priprema po fazama",
        text: "Plan se vodi tjedan po tjedan, sve do završnice.",
      },
      {
        title: "Dan natjecanja",
        text: "Na pozornicu izlaziš s planom za svaki detalj, a ne s nagađanjem.",
      },
    ],
    notes: [
      "Pripreme kraće od 3 mjeseca prihvaćam samo pod posebnim uvjetima, uz dogovor.",
      "Ako dosad nismo surađivali, svaki termin za trening ili pozing uživo naplaćuje se dodatno.",
    ],
    faq: [
      {
        q: "Koliko ranije trebam početi s pripremom?",
        a: "Najmanje 3 mjeseca prije natjecanja. Kraće pripreme prihvaćam samo pod posebnim uvjetima, uz dogovor.",
      },
      {
        q: "Je li pozing uključen?",
        a: "Pomoć oko pozinga dogovaramo posebno. Ako dosad nismo surađivali, termini za trening i pozing uživo dodatno se naplaćuju.",
      },
      {
        q: "Nikad nisam nastupao. Mogu li se prijaviti?",
        a: "Možeš. Pripremao sam natjecatelje od prvog nastupa do pro karte. Na početku procijenimo gdje si i koliko vremena realno treba.",
      },
    ],
    image: "/images/om-konstrukcija.jpg",
  },
];

export function getPackage(slug: string) {
  return packages.find((p) => p.slug === slug);
}

export const legacySlugs: Record<string, PackageSlug> = {
  "klasicni-coaching": "online-coaching",
  "edukacija-za-trenere": "coaching-i-edukacija",
  "paket-12-sedmica": "paket-12-tjedana",
  "takmicarske-pripreme": "natjecateljske-pripreme",
};

export function formatPrice(value: number) {
  return `${value.toLocaleString("de-DE")} €`;
}

export type PriceItem = {
  name: string;
  detail?: string;
  price: string;
  unit?: string;
  anchor?: string;
  href?: string;
};

export type PriceGroup = { id: string; title: string; text: string; items: PriceItem[] };

export function onlinePriceGroup(list: CoachingPackage[]): PriceGroup {
  return {
    id: "online",
    title: "Online coaching",
    text: "Paketi s upitnikom i prijavom putem stranice.",
    items: list.map((p) => ({
      name: p.name,
      detail: `${p.checkIn}. ${p.priceNote}.`,
      price: formatPrice(p.price),
      anchor: formatPrice(p.anchorPrice),
      unit: p.priceUnit,
      href: `/paketi/${p.slug}`,
    })),
  };
}

export const extraPriceGroups: PriceGroup[] = [
  {
    id: "konzultacije",
    title: "Konzultacije",
    text: "Jedan razgovor za konkretna pitanja o treningu, prehrani ili pripremi.",
    items: [
      { name: "Konzultacije do 30 minuta", price: "30 do 50 €" },
      { name: "Konzultacije do 60 minuta", price: "50 do 100 €" },
    ],
  },
  {
    id: "trening",
    title: "Osobni trening",
    text: "Treninzi uživo, pojedinačno ili kao mjesečni paket.",
    items: [
      { name: "Osobni trening", detail: "Jedan termin", price: "50 do 80 €" },
      { name: "Osobni treninzi, mjesečno", price: "350 do 550 €" },
      { name: "Paket Advance", detail: "Coaching i treninzi uživo", price: "200 do 400 €" },
    ],
  },
  {
    id: "clanstvo",
    title: "Članstvo",
    text: "Dugoročna suradnja po povoljnijoj cijeni.",
    items: [
      { name: "Polugodišnje članstvo", price: "800 do 1.000 €" },
      { name: "Godišnje članstvo", price: "1.650 do 2.000 €" },
    ],
  },
  {
    id: "edukacija",
    title: "Edukacija i predavanja",
    text: "Za trenere, klubove i sve koji žele znati više.",
    items: [
      { name: "Sportske poduke i predavanja", detail: "Jedan sat", price: "30 do 40 €" },
      { name: "Seminar", detail: "Po osobi", price: "300 do 400 €" },
    ],
  },
];

export const priceList: PriceGroup[] = [onlinePriceGroup(packages), ...extraPriceGroups];
