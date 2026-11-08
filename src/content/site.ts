export const site = {
  name: "Adnan Gosto",
  email: "adnan.adoni.gosto@gmail.com",
  instagram: "https://www.instagram.com/adnan.adoni.gosto/",
  instagramHandle: "@adnan.adoni.gosto",
  whatsapp: null as string | null,
  shop: {
    url: null as string | null,
    discount: "10%",
    code: null as string | null,
  },
};

export const hero = {
  title: "Tvoja forma.",
  titleAccent: "Tvoj tempo.",
  subtitle:
    "Plan treninga i prehrane koji se uklapa u tvoj posao i obaveze, bez spartanskog režima. Iza njega stoji trener čiji su takmičari osvojili Arnold Classic i četiri pro karte.",
  primaryCta: { label: "Pogledaj pakete i cijene", href: "#saradnja" },
};

export const heroProof = [
  "IFBB Pro Card, Budimpešta 2021.",
  "Takmičari sa zlatom na Arnold Classicu",
  "15 godina online coachinga",
];

export const heroPaths = [
  { id: "forma", label: "Želim formu i zdravlje" },
  { id: "bina", label: "Spremam takmičenje" },
  { id: "znanje", label: "Trener sam" },
] as const;

export const stats = [
  { value: "15", label: "godina online coachinga" },
  { value: "77+", label: "zlata koja su osvojili moji takmičari" },
  { value: "4", label: "pro karte s takmičarima" },
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

export const process = [
  {
    title: "Izabereš paket",
    text: "Četiri paketa, svaki s jasnom cijenom i načinom rada. Ako nisi siguran, pomoći će ti kratko pitanje iznad paketa.",
  },
  {
    title: "Popuniš upitnik",
    text: "Pitanja o tvom stanju, rutini i ciljevima, plus slike. Oko deset minuta i odmah vidim kompletnu situaciju.",
  },
  {
    title: "Dobiješ početni plan",
    text: "Javim ti se na mail, dogovorimo početak, a plan treninga i prehrane složim prema tvojim mogućnostima.",
  },
  {
    title: "Check-in i prilagodbe",
    text: "Svakih 7 dana ili svake 4 sedmice, zavisno od paketa. Kad tijelo krene drugačije od plana, plan se mijenja.",
  },
];

export const coachingAchievements = [
  "4 pro karte s takmičarima",
  "Pobjeda na svjetskom prvenstvu",
  "Pobjeda na evropskom prvenstvu",
  "Arnold Classic, apsolutna pobjeda",
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

export type TransformationCategory = "rekreativci" | "takmicari";

export type TransformationPhoto = {
  src: string;
  alt: string;
  category: TransformationCategory;
};

export const transformationCategories: { id: TransformationCategory; label: string }[] = [
  { id: "rekreativci", label: "Rekreativci" },
  { id: "takmicari", label: "Takmičari" },
];

export const transformationPhotos: TransformationPhoto[] = Array.from({ length: 11 }, (_, i) => ({
  src: `/images/transformacije/tr-${String(i + 1).padStart(2, "0")}.jpg`,
  alt: `Transformacija klijenta ${i + 1}: fotografija prije i poslije saradnje`,
  category: "rekreativci",
}));

export const about = {
  title: "Iskustvo s bine, ne iz knjige",
  paragraphs: [
    "U sportu sam od svoje osme godine, a u teretanu sam prvi put ušao 2008. Već 2011. su mi se javljali prvi ljudi za plan treninga i prehrane, i to je postalo posao od kojeg živim.",
    "Sa takmičarima sam osvojio sve što se u amaterskom bodybuildingu može osvojiti, a s rekreativcima napravio transformacije i u najtežim uslovima. Danas sistem pravim tako da radi za svakoga, uz posao i obaveze.",
  ],
  timeline: [
    { year: "2008", text: "Prvi put u teretani, administrator regionalnih fitness foruma" },
    { year: "2011", text: "Prvi klijenti i početak online coachinga" },
    { year: "2012", text: "Prvi nastup i titula apsolutnog prvaka BiH" },
    {
      year: "2015",
      text: "Četvrta uzastopna titula apsolutnog prvaka BiH, Mr. Olympia Amateur Spain",
    },
    { year: "2016", text: "Pobjeda na Balkanskom prvenstvu" },
    { year: "2018", text: "Elite Pro debi" },
    { year: "2021", text: "Apsolutni pobjednik Fit Parade u Budimpešti i IFBB Pro Card" },
    { year: "2022", text: "IFBB Pro nastup na Yamamoto Cup Pro" },
    { year: "2024", text: "Predavač na fitness učilištu u Zagrebu" },
  ],
};

export const faq = [
  {
    q: "Koji paket je za mene?",
    a: "Ako želiš sedmično praćenje i stalne izmjene, uzmi online coaching. Ako želiš napredak bez velikog pritiska i check-in jednom mjesečno, paket 12 sedmica. Trenerima je namijenjen coaching i edukacija, a takmičarima pripreme.",
  },
  {
    q: "Kako izgleda check-in?",
    a: "Pošalješ slike i podatke koje tražim, a ja na osnovu njih postavim plan za naredni period. Kod online coachinga je to svakih 7 dana, a kod paketa 12 sedmica svake 4 sedmice.",
  },
  {
    q: "Šta ako zakasnim s check-inom?",
    a: "Ništa strašno. Razmak od 7 do 10 dana je potpuno u redu. Trenutni plan ne prestaje davati rezultate zato što je prošlo par dana više.",
  },
  {
    q: "Radiš li vikendom?",
    a: "Ne. Vikendom uglavnom nisam dostupan. Od ponedjeljka radim izmjene redom, kako su check-inovi stizali od subote.",
  },
  {
    q: "Moram li se odreći svega što volim?",
    a: "Ne. Sistem je napravljen tako da radi uz posao, obaveze i društveni život. U upitniku navedeš navike kojih se ne želiš odreći i plan se slaže oko njih.",
  },
  {
    q: "Mogu li raditi s tobom ako nisam iz BiH?",
    a: "Možeš. Sve se radi online, bez obzira gdje živiš. U upitniku samo navedeš državu iz koje ide uplata.",
  },
  {
    q: "Šta trebam pripremiti za prijavu?",
    a: "Slike cijelog tijela, od glave do pete, uz dobro svjetlo i bez sjenki. Uz to jutarnju kilažu i kratak opis treninga, prehrane i dnevne rutine.",
  },
  {
    q: "Šta se desi kad pošaljem prijavu?",
    a: "Stigne ti potvrda na mail. Pregledam odgovore i slike, javim ti se s dogovorom oko početka i uplate, i nakon toga dobiješ početni plan.",
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
