export type PackageSlug =
  "online-coaching" | "paket-12-sedmica" | "coaching-i-edukacija" | "takmicarske-pripreme";

export type PackageFaq = { q: string; a: string };

export type CoachingPackage = {
  slug: PackageSlug;
  name: string;
  shortName: string;
  badge?: string;
  tagline: string;
  audience: string;
  price: number;
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

export const ADNAN_EMAIL = "adnan.adoni.gosto@gmail.com";

export const packages: CoachingPackage[] = [
  {
    slug: "online-coaching",
    name: "Online coaching",
    shortName: "Online coaching",
    tagline: "Klasični online coaching uz sedmični check-in i stalno prilagođavanje plana.",
    audience: "Za one koji žele redovno praćenje i plan koji se mijenja zajedno s njima.",
    price: 180,
    priceUnit: "mjesečno",
    priceNote: "Plaća se mjesečno",
    checkIn: "Check-in svakih 7 dana",
    billing: "mjesečno",
    cardFeatures: [
      "Početni plan treninga i prehrane po upitniku",
      "Check-in i izmjene svakih 7 dana",
      "Dostupan za pitanja između check-inova",
    ],
    intro: [
      "Klasičan oblik online coachinga. Svake sedmice šalješ check-in, ja pratim napredak i prilagođavam sve parametre tvojim potrebama i mogućnostima.",
      "Sve kreće od upitnika koji mi daje precizan uvid u tvoje stanje, mogućnosti i ciljeve. Prema njemu slažem početni plan, a onda ga doradim sa svakim check-inom.",
    ],
    forWho: [
      "Želiš da neko prati svaki tvoj korak i reaguje na vrijeme",
      "Imaš jasan cilj i spreman si raditi sedmicu po sedmicu",
      "Želiš plan koji se mijenja kako se mijenja tvoje tijelo",
    ],
    includes: [
      {
        title: "Upitnik i početni plan",
        text: "Detaljan upitnik o tvom stanju, rutini i ciljevima, pa plan treninga i prehrane složen prema njemu.",
      },
      {
        title: "Check-in svakih 7 dana",
        text: "Šalješ slike i podatke, a ja na osnovu njih postavljam sve parametre za narednu sedmicu.",
      },
      {
        title: "Stalna prilagodba",
        text: "Trening, prehrana i suplementacija se mijenjaju kad tijelo krene drugačije od plana.",
      },
      {
        title: "Pitanja između check-inova",
        text: "Radnim danima sam na raspolaganju za sva pitanja vezana za sam proces.",
      },
    ],
    steps: [
      {
        title: "Popuniš upitnik",
        text: "Odgovoriš na pitanja i pošalješ slike. Tako odmah vidim kompletnu situaciju.",
      },
      {
        title: "Dobiješ početni plan",
        text: "Trening i prehrana složeni prema tvojoj rutini, mogućnostima i cilju.",
      },
      {
        title: "Check-in svake sedmice",
        text: "Dan biraš sam. Nije bitno da li je ponedjeljak ili četvrtak, bitno je da si redovan.",
      },
      {
        title: "Izmjene i napredak",
        text: "Nakon svakog check-ina dobiješ upute za narednu sedmicu, sve do cilja.",
      },
    ],
    notes: [
      "Vikendom ne radim. Izmjene radim od ponedjeljka, redom kako su check-inovi stizali od subote.",
      "Ako check-in pošalješ u ponedjeljak ujutro, može se desiti da odgovor stigne dan kasnije. Trenutni plan i dalje daje rezultate.",
      "Tvoj zadatak je da budeš redovan. Razmak od 7 do 10 dana između check-inova je potpuno u redu.",
    ],
    faq: [
      {
        q: "Koji dan šaljem check-in?",
        a: "Nema određenog dana. Šalješ ga kad ti odgovara, samo da razmak bude otprilike 7 dana. I 7 do 10 dana je u redu.",
      },
      {
        q: "Šta ako zakasnim s check-inom par dana?",
        a: "Ništa strašno. Nije bitno da li je check-in poslan isti dan kao prošle sedmice ili 2 do 3 dana kasnije. Bitno je da si redovan.",
      },
      {
        q: "Odgovaraš li vikendom?",
        a: "Ne. Vikendom uglavnom nisam dostupan. Od ponedjeljka radim izmjene redom kako su check-inovi stizali.",
      },
    ],
    image: "/images/om-ledja.jpg",
  },
  {
    slug: "paket-12-sedmica",
    name: "Paket 12 sedmica",
    shortName: "12 sedmica",
    badge: "Za početnike",
    tagline: "Napredak bez pritiska. Plan koji se uklapa u tvoj život, a ne obrnuto.",
    audience: "Za početnike i srednje iskusne koji žele rezultat bez spartanskog pristupa.",
    price: 480,
    priceUnit: "za 12 sedmica",
    priceNote: "Plaća se jednom unaprijed, za sva 3 mjeseca",
    checkIn: "Check-in svake 4 sedmice",
    billing: "jednokratno",
    cardFeatures: [
      "Početni plan treninga i prehrane po upitniku",
      "3 check-ina, svake 4 sedmice, preko e-maila",
      "Bez odricanja od svega i bez spartanskog režima",
    ],
    intro: [
      "Početak je isti kao kod online coachinga. Popuniš upitnik, a ja prema tvojoj situaciji složim polazni plan.",
      "Check-in ide svake 4 sedmice, što znači 3 check-ina tokom jednog bloka od 12 sedmica. Sve ide preko e-maila. Poslije 12 sedmica možeš produžiti na isti način ili preći na online coaching.",
    ],
    forWho: [
      "Želiš napredak, ali ne želiš pratiti program iz dana u dan",
      "Ne želiš se odreći društvenog života i svega što voliš",
      "Imaš višak kilograma, manjak kilograma ili samo želiš izgraditi mišić bez žurbe",
      "Želiš manje treninga sedmično, a da i dalje vidiš rezultat",
    ],
    includes: [
      {
        title: "Upitnik i polazni plan",
        text: "Plan treninga i prehrane složen prema tvom stanju, rutini i navikama kojih se ne želiš odreći.",
      },
      {
        title: "3 check-ina u 12 sedmica",
        text: "Svake 4 sedmice šalješ check-in, a ja prilagodim plan za naredni period.",
      },
      {
        title: "Tempo koji sam biraš",
        text: "Sistem radi onoliko koliko se posvetiš. Može donijeti male pomake ili iznadprosječnu transformaciju.",
      },
      {
        title: "Nastavak po želji",
        text: "Nakon 12 sedmica produžiš isti paket ili pređeš na online coaching sa sedmičnim check-inom.",
      },
    ],
    steps: [
      {
        title: "Popuniš upitnik",
        text: "Navedeš i navike kojih se ne želiš odreći i šta tačno očekuješ od ovih 12 sedmica.",
      },
      {
        title: "Dobiješ polazni plan",
        text: "Plan je složen tako da se uklopi u tvoj posao, obaveze i slobodno vrijeme.",
      },
      {
        title: "Check-in svake 4 sedmice",
        text: "Ukupno 3 check-ina preko e-maila. Između njih radiš po planu svojim tempom.",
      },
      {
        title: "Produžiš ili nastaviš dalje",
        text: "Poslije 12 sedmica biraš novi blok ili prelazak na online coaching.",
      },
    ],
    why: {
      title: "Zašto check-in samo svake 4 sedmice?",
      paragraphs: [
        "Petnaest godina rada s ljudima pokazalo je da više od polovine rekreativaca želi napredak i rezultat, ali ne želi strogo praćenje programa iz dana u dan, stalne restrikcije i propuštanje društvenog života.",
        "Ljudi godinama dolaze u teretanu i izgledaju isto. Da su svakih mjesec ili dva imali i najmanji napredak, za dvije godine bi imali drugo tijelo. Ovaj paket je kompromis između cijene i utroška vremena, za isti cilj.",
        "Program je onoliko učinkovit koliko ga ti napraviš učinkovitim. Može se napraviti i vrhunski rezultat, ali je prije svega osmišljen za one koji ne postavljaju ljestvicu visoko.",
      ],
    },
    notes: [
      "Cijena pokriva sva 3 mjeseca i plaća se jednom, unaprijed.",
      "Komunikacija i check-in idu isključivo preko e-maila.",
    ],
    faq: [
      {
        q: "Je li ovaj paket samo za početnike?",
        a: "Napravljen je za početnike i srednje iskusne, ali i za sve koji žele napredak bez velikog pritiska. Isti sistem može donijeti i iznadprosječnu transformaciju, zavisno od toga koliko se posvetiš.",
      },
      {
        q: "Šta nakon 12 sedmica?",
        a: "Možeš produžiti saradnju na isti način ili preći na online coaching sa check-inom svakih 7 dana.",
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
      "Ovaj oblik saradnje je za one koji žele naučiti kako proces zaista radi, ili unaprijediti svoje znanje u radu s klijentima.",
      "Teorija bez prakse ne vrijedi mnogo. Zato zajedno prolazimo kroz tvoju transformaciju, ili zajedno vodimo jednog od tvojih klijenata, na kojem ti detaljno objašnjavam cijeli proces.",
    ],
    forWho: [
      "Trener si i želiš bolje rezultate sa svojim klijentima",
      "Iskusniji si vježbač i želiš razumjeti zašto se nešto radi",
      "Želiš naučiti kako se rješava stagnacija u procesu",
    ],
    includes: [
      {
        title: "Coaching kroz cijeli proces",
        text: "Transformacija tebe ili tvog klijenta, s planom treninga i prehrane i redovnim izmjenama.",
      },
      {
        title: "Objašnjenje svakog koraka",
        text: "Za svaku izmjenu znaš zašto se radi, kako se donosi odluka i šta se očekuje.",
      },
      {
        title: "Rješavanje stagnacije",
        text: "Kroz stvarne situacije pokazujem kako se prepozna i riješi zastoj u napretku.",
      },
      {
        title: "Pitanja kad god zatrebaju",
        text: "Na raspolaganju sam i za sva dodatna pitanja vezana za trening i prehranu.",
      },
    ],
    steps: [
      {
        title: "Biraš na kome radimo",
        text: "Na tebi ili na tvom klijentu. U upitniku navedeš i šta te više zanima, trening ili prehrana.",
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
        "Radio sam s nekim od najboljih trenera na svijetu i nakon svakog procesa moj pristup se mijenjao. Ne zato što sam kopirao tuđe, nego zato što mi se mijenjao način razmišljanja i rješavanja problema.",
        "Od 2024. sam i predavač na fitnes učilištu u Zagrebu. Isto iskustvo prenosim i ovdje, samo na tvom konkretnom primjeru.",
      ],
    },
    notes: ["Cijena uključuje coaching, odnosno proces transformacije, i edukaciju."],
    faq: [
      {
        q: "Mogu li raditi na svom klijentu umjesto na sebi?",
        a: "Možeš. Zajedno vodimo jednog od tvojih klijenata i na njemu ti objašnjavam cijeli proces rada.",
      },
      {
        q: "Šta ako me više zanima prehrana nego trening?",
        a: "U upitniku označiš segment koji ti je bitniji i fokus edukacije stavljamo na njega.",
      },
    ],
    image: "/images/om-portret.jpg",
  },
  {
    slug: "takmicarske-pripreme",
    name: "Takmičarske pripreme",
    shortName: "Takmičarske pripreme",
    tagline:
      "Priprema za binu od trenera čiji su takmičari osvojili sve u amaterskom bodybuildingu.",
    audience: "Za takmičare, od prvog nastupa do pro karte.",
    price: 220,
    priceUnit: "mjesečno",
    priceNote: "Plaća se mjesečno",
    checkIn: "Plan do dana takmičenja",
    billing: "mjesečno",
    cardFeatures: [
      "Priprema za konkretno takmičenje i datum",
      "Trening, prehrana i završnica do bine",
      "Pomoć oko pozinga po dogovoru",
    ],
    intro: [
      "Kao trener, sa svojim takmičarima osvojio sam sve što se u amaterskom bodybuildingu moglo osvojiti, od državnih prvenstava do svjetskog prvenstva, Arnold Classica i pro karata.",
      "Pripremu slažemo prema datumu takmičenja i tačnom broju sedmica koje imamo na raspolaganju.",
    ],
    forWho: [
      "Spremaš se za prvo takmičenje i želiš ga odraditi kako treba",
      "Već nastupaš i želiš podići formu na viši nivo",
      "Ciljaš internacionalna takmičenja i pro kartu",
    ],
    includes: [
      {
        title: "Plan za cijelu pripremu",
        text: "Trening, prehrana i suplementacija složeni prema datumu nastupa i tvom iskustvu.",
      },
      {
        title: "Završnica do detalja",
        text: "Zadnje sedmice i dani pred binu, gdje se priprema dobija ili gubi.",
      },
      {
        title: "Pozing po dogovoru",
        text: "Ako ti treba pomoć oko pozinga, navedeš to u upitniku pa se dogovorimo.",
      },
      {
        title: "Iskustvo s velikih bina",
        text: "Arnold Classic, svjetsko i evropsko prvenstvo, četiri pro karte s takmičarima.",
      },
    ],
    steps: [
      {
        title: "Navedeš datum takmičenja",
        text: "U upitniku upišeš takmičenje, datum i dosadašnje iskustvo na bini.",
      },
      {
        title: "Procjena forme",
        text: "Prema slikama i podacima procijenim gdje si i koliko vremena realno treba.",
      },
      {
        title: "Priprema po fazama",
        text: "Plan se vodi sedmicu po sedmicu, sve do završnice.",
      },
      {
        title: "Dan takmičenja",
        text: "Na binu izlaziš s planom za svaki detalj, a ne s nagađanjem.",
      },
    ],
    notes: [
      "Pripreme kraće od 3 mjeseca prihvatam samo pod posebnim uslovima, uz dogovor.",
      "Ako dosad nismo sarađivali, svaki termin za trening ili pozing uživo naplaćuje se dodatno.",
    ],
    faq: [
      {
        q: "Koliko ranije trebam početi s pripremom?",
        a: "Najmanje 3 mjeseca prije takmičenja. Kraće pripreme prihvatam samo pod posebnim uslovima, uz dogovor.",
      },
      {
        q: "Je li pozing uključen?",
        a: "Pomoć oko pozinga dogovaramo posebno. Ako dosad nismo sarađivali, termini za trening i pozing uživo se dodatno naplaćuju.",
      },
      {
        q: "Nikad nisam nastupao. Mogu li se prijaviti?",
        a: "Možeš. Pripremao sam takmičare od prvog nastupa do pro karte. Na početku procijenimo gdje si i koliko vremena realno treba.",
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
};

export function formatPrice(value: number) {
  return `${value.toLocaleString("de-DE")} €`;
}

export type PriceItem = {
  name: string;
  detail?: string;
  price: string;
  unit?: string;
  href?: string;
};

export type PriceGroup = { id: string; title: string; text: string; items: PriceItem[] };

export const priceList: PriceGroup[] = [
  {
    id: "online",
    title: "Online coaching",
    text: "Paketi s upitnikom i prijavom preko stranice.",
    items: packages.map((p) => ({
      name: p.name,
      detail: `${p.checkIn}. ${p.priceNote}.`,
      price: formatPrice(p.price),
      unit: p.priceUnit,
      href: `/paketi/${p.slug}`,
    })),
  },
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
    title: "Lični trening",
    text: "Treninzi uživo, pojedinačno ili kao mjesečni paket.",
    items: [
      { name: "Lični trening", detail: "Jedan termin", price: "50 do 80 €" },
      { name: "Lični treninzi, mjesečno", price: "350 do 550 €" },
      { name: "Paket Advance", detail: "Coaching i treninzi uživo", price: "200 do 400 €" },
    ],
  },
  {
    id: "clanstvo",
    title: "Članstvo",
    text: "Dugoročna saradnja po povoljnijoj cijeni.",
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
      { name: "Sportske poduke i predavanja", detail: "Jedan čas", price: "30 do 40 €" },
      { name: "Seminar", detail: "Po osobi", price: "300 do 400 €" },
    ],
  },
];
