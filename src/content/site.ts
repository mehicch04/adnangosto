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

export const site = {
  name: "Adnan Gosto",
  instagram: "https://www.instagram.com/adnan.adoni.gosto/",
  instagramHandle: "@adnan.adoni.gosto",
};

export const hero = {
  kicker: "IFBB Pro i trener takmičara",
  title: "Od prvog treninga",
  titleAccent: "do bine.",
  subtitle:
    "Trener od 2011, takmičar od 2012, IFBB Pro od 2021. Vodim takmičare kroz cijelu sezonu, rekreativce do forme koja se zadrži i trenere do znanja koje se ne uči iz knjiga.",
  primaryCta: { label: "Izaberi saradnju", href: "#saradnja" },
  secondaryCta: { label: "Rezultati takmičara", href: "#rezultati" },
};

export const stats = [
  { value: "19", label: "zlatnih medalja u vlastitoj karijeri" },
  { value: "77+", label: "zlata koja su osvojili moji takmičari" },
  { value: "4×", label: "zaredom apsolutni prvak BiH" },
  { value: "Pro", label: "IFBB Pro Card, Fit Parade Budimpešta 2021." },
];

export const marquee = [
  "Arnold Classic Barcelona",
  "IFBB Svjetsko prvenstvo",
  "Fit Parade Budimpešta",
  "Romania Muscle Fest Pro",
  "Diamond Cup",
  "Balkansko prvenstvo",
  "Amateur Olympia",
  "Yamamoto Cup Pro",
];

export const fallbackPackages: Package[] = [
  {
    slug: "klasicni-coaching",
    name: "Klasični coaching",
    tagline: "Individualni plan treninga i ishrane uz redovne provjere.",
    audience: "Za ozbiljan napredak uz stručno vodstvo",
    duration: "Mjesečno",
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
    audience: "Za vidljivu promjenu u zadanom roku",
    duration: "12 sedmica",
    price_label: "na upit",
    features: ["Početna procjena", "Plan po fazama", "Praćenje napretka", "Završna analiza"],
  },
  {
    slug: "edukacija-za-trenere",
    name: "Edukacija za trenere",
    tagline: "Znanje iz takmičarske prakse za trenere koji rade s klijentima.",
    audience: "Za trenere i one koji to žele postati",
    duration: "Po dogovoru",
    price_label: "na upit",
    features: [
      "Priprema takmičara",
      "Planiranje ishrane",
      "Rad s klijentima",
      "Predavanja i seminari",
    ],
  },
];

export const process = [
  {
    title: "Popuniš prijavu",
    text: "Izabereš paket i odgovoriš na pitanja o cilju, iskustvu i treningu. Par minuta.",
  },
  {
    title: "Pregledam i javim se",
    text: "Pročitam odgovore i javim ti se s prijedlogom. Ne objašnjavaš ništa ispočetka.",
  },
  {
    title: "Dobiješ plan",
    text: "Trening i ishrana složeni za tvoje tijelo, raspored i cilj. Bez šablona.",
  },
  {
    title: "Pratimo i mijenjamo",
    text: "Redovne provjere. Kad tijelo krene drugačije od plana, plan se prilagodi.",
  },
];

export const coachingTotals = [
  { value: "77+", label: "zlata" },
  { value: "56", label: "srebra" },
  { value: "26", label: "bronzi" },
  { value: "4", label: "Elite Pro karte" },
];

export const clientResults: {
  name: string;
  image: string | null;
  title: string;
  results: string[];
}[] = [
  {
    name: "Andrej Mandić",
    image: "/images/takmicari/t1.jpg",
    title: "IFBB Elite Pro",
    results: [
      "Arnold Classic Barcelona 2019, 1. mjesto i apsolutni pobjednik",
      "IFBB Svjetsko prvenstvo 2020, 1. mjesto preko 100 kg",
    ],
  },
  {
    name: "Vladica Jovanović",
    image: "/images/takmicari/t2.jpg",
    title: "IFBB Elite Pro",
    results: ["Diamond Cup Malta 2017, 1. mjesto", "Amateur Olympia Spain 2017, 3. mjesto"],
  },
  {
    name: "Mirnes Husanović",
    image: "/images/takmicari/t4.jpg",
    title: "IFBB Pro",
    results: ["Juniorski apsolutni prvak BiH 2013", "Višestruki državni prvak do 80 kg"],
  },
  {
    name: "Meldin Zimić",
    image: "/images/takmicari/t5.jpg",
    title: "Classic bodybuilding",
    results: ["Sarajevo Open 2017, apsolutni pobjednik", "Državni prvak BiH 2017"],
  },
  {
    name: "Jasmin Hodžić",
    image: null,
    title: "Bodybuilding do 100 kg",
    results: ["Balkansko prvenstvo 2017, 1. mjesto"],
  },
];

export const fallbackTransformations: Transformation[] = [];

export const about = {
  title: "Iskustvo s bine, ne iz knjige",
  paragraphs: [
    "Zovem se Adnan Gosto i dolazim iz Mostara. Od 2011. radim kao privatni trener, a 2012. sam prvi put stao na binu i tu pronašao sebe.",
    "Radio sam uz neka od najvećih imena ove scene, Patricka Tuora, Ahmada Askara i Maura Sassija. Sve što sam naučio na svojoj koži danas prenosim na ljude s kojima radim.",
  ],
  timeline: [
    { year: "2011", text: "Počinjem raditi kao privatni trener" },
    { year: "2012", text: "Prvi nastup i titula apsolutnog prvaka BiH" },
    {
      year: "2015",
      text: "Četvrta uzastopna titula apsolutnog prvaka BiH, Mr. Olympia Amateur Spain",
    },
    { year: "2016", text: "Pobjeda na Balkanskom prvenstvu" },
    { year: "2018", text: "Elite Pro debi" },
    { year: "2021", text: "Apsolutni pobjednik Fit Parade u Budimpešti i IFBB Pro Card" },
    { year: "2022", text: "IFBB Pro nastup na Yamamoto Cup Pro" },
  ],
};

export const faq = [
  {
    q: "Moram li biti takmičar da bih radio s tobom?",
    a: "Ne. Radim i s rekreativcima koji žele formu koja se zadrži, i s takmičarima koji se spremaju za binu. Plan se pravi prema tvom cilju, ne prema tuđem.",
  },
  {
    q: "Radiš li online ili samo uživo?",
    a: "Oboje. Online coaching radi bez obzira gdje živiš. Trening, ishrana i provjere idu na daljinu, a ti dobiješ isto vodstvo kao i uživo.",
  },
  {
    q: "Koliko košta saradnja?",
    a: "Cijena zavisi od paketa i od toga šta ti treba. Konkretnu ponudu dobiješ nakon što popuniš prijavu, bez ikakve obaveze.",
  },
  {
    q: "Nikad nisam nastupao. Mogu li se spremiti za prvo takmičenje?",
    a: "Možeš. Pripremao sam takmičare od prvog državnog prvenstva do Arnold Classica. Na početku procijenimo gdje si i koliko vremena realno treba.",
  },
  {
    q: "Šta se desi kad pošaljem prijavu?",
    a: "Pročitam tvoje odgovore i javim ti se s prijedlogom kako da krenemo. Ne moraš ništa objašnjavati ispočetka.",
  },
];

export const instagramFallback = [
  { src: "/images/om-konstrukcija.jpg", alt: "Poza na čeličnoj konstrukciji" },
  { src: "/images/om-ledja.jpg", alt: "Trening u teretani" },
  { src: "/images/om-narandzasta.jpg", alt: "Fotografija ispred narandžastog zida" },
  { src: "/images/om-portret.jpg", alt: "Prednja poza" },
  { src: "/images/om-ledja-krov.jpg", alt: "Poza leđa na krovu" },
  { src: "/images/om-majica.jpg", alt: "U teretani" },
];

export type SponsorStyle = "display" | "heavy" | "italic" | "wide";

export type Sponsor = {
  name: string;
  logo: string | null;
  url: string | null;
  style?: SponsorStyle;
};

export const fallbackSponsors: Sponsor[] = [
  { name: "Olimp Sport Nutrition", logo: null, url: null, style: "heavy" },
  { name: "BioTechUSA", logo: null, url: null, style: "heavy" },
  { name: "Scitec", logo: null, url: null, style: "italic" },
  { name: "Applied Nutrition", logo: null, url: null, style: "wide" },
  { name: "MuscleTech", logo: null, url: null, style: "display" },
  { name: "Dymatize", logo: null, url: null, style: "italic" },
  { name: "Gymshark", logo: null, url: null, style: "wide" },
];

export type Testimonial = {
  name: string;
  role: string;
  quote: string;
  image: string | null;
};

export const fallbackTestimonials: Testimonial[] = [
  {
    name: "Amar K.",
    role: "Takmičar, Men's Physique",
    quote:
      "Prvi put sam na binu izašao spreman do detalja. Svaka sedmica je imala jasan plan, a zadnje dvije sedmice su bile odrađene bez ikakvog nagađanja.",
    image: null,
  },
  {
    name: "Lejla H.",
    role: "Rekreativka",
    quote:
      "Nakon godina krugova s dijetama prvi put imam ishranu koju mogu držati. Forma je ostala i kad je program završio.",
    image: null,
  },
  {
    name: "Haris M.",
    role: "Trener",
    quote:
      "Edukacija mi je promijenila način na koji radim s klijentima. Konkretno, praktično i bez teorije koja ne služi ničemu.",
    image: null,
  },
  {
    name: "Edin S.",
    role: "Takmičar, Classic Physique",
    quote:
      "Adnan zna kad treba stisnuti, a kad pustiti. Takav osjećaj za pripremu dolazi samo od nekoga ko je sve to prošao sam.",
    image: null,
  },
  {
    name: "Selma B.",
    role: "Takmičarka, Bikini",
    quote:
      "Uz poziranje i pripremu dobila sam i mir u glavi. Uvijek je bio tu za pitanje, i u šest ujutro i u ponoć.",
    image: null,
  },
  {
    name: "Tarik D.",
    role: "Rekreativac",
    quote:
      "Minus 14 kilograma za šest mjeseci, a trening nikad nije bio dosadan. Najbolja investicija koju sam napravio u sebe.",
    image: null,
  },
  {
    name: "Nermin A.",
    role: "Takmičar, Bodybuilding",
    quote:
      "Godinama sam trenirao sam i stajao u mjestu. Prvi off season s Adnanom donio je više mase nego prethodne tri godine.",
    image: null,
  },
  {
    name: "Ajla P.",
    role: "Rekreativka",
    quote:
      "Plan prilagođen mom poslu i porodici, bez stresa i bez izgovora. Konačno se osjećam jako i sigurno u sebe.",
    image: null,
  },
];
