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

export const business = {
  name: "Adoni, obrt za trgovinu i usluge",
  owner: "Adnan Gosto",
  street: "Remetinečki Gaj 21d",
  city: "10000 Zagreb",
  phone: "092 339 7212",
  phoneHref: "tel:+385923397212",
  mbo: "",
};

export const hero = {
  word: "ADONI",
  title: "Tvoja forma.",
  titleAccent: "Tvoj tempo.",
  subtitle:
    "Plan treninga i prehrane koji se uklapa u tvoj posao i obveze, bez spartanskog režima. Iza njega stoji trener čiji su natjecatelji osvojili Arnold Classic i četiri pro karte.",
  primaryCta: { label: "Pogledaj pakete i cijene", href: "#suradnja" },
};

export const heroProof = [
  "IFBB Pro Card, Budimpešta 2021.",
  "Natjecatelji sa zlatom na Arnold Classicu",
  "15 godina online coachinga",
];

export const heroPaths = [
  { id: "forma", label: "Želim formu i zdravlje" },
  { id: "bina", label: "Spremam natjecanje" },
  { id: "znanje", label: "Trener sam" },
] as const;

export const stats = [
  { value: "15", label: "godina online coachinga" },
  { value: "77+", label: "zlata koja su osvojili moji natjecatelji" },
  { value: "4", label: "pro karte s natjecateljima" },
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
    title: "Odabereš paket",
    text: "Četiri paketa, svaki s jasnom cijenom i načinom rada. Ako nisi siguran, pomoći će ti kratko pitanje iznad paketa.",
  },
  {
    title: "Ispuniš upitnik",
    text: "Pitanja o tvom stanju, rutini i ciljevima, uz slike. Oko deset minuta i odmah vidim cijelu situaciju.",
  },
  {
    title: "Dobiješ početni plan",
    text: "Javim ti se na mail, dogovorimo početak, a plan treninga i prehrane složim prema tvojim mogućnostima.",
  },
  {
    title: "Check-in i prilagodbe",
    text: "Svakih 7 dana ili svaka 4 tjedna, ovisno o paketu. Kad tijelo krene drugačije od plana, plan se mijenja.",
  },
];

export const coachingAchievements = [
  "4 pro karte s natjecateljima",
  "Pobjeda na svjetskom prvenstvu",
  "Pobjeda na europskom prvenstvu",
  "Arnold Classic, apsolutna pobjeda",
];

export const coachingTotals = [
  { value: "77+", label: "zlata" },
  { value: "56", label: "srebra" },
  { value: "26", label: "bronci" },
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
  { id: "takmicari", label: "Natjecatelji" },
];

export const transformationPhotos: TransformationPhoto[] = Array.from({ length: 11 }, (_, i) => ({
  src: `/images/transformacije/tr-${String(i + 1).padStart(2, "0")}.jpg`,
  alt: `Transformacija klijenta ${i + 1}: fotografija prije i poslije suradnje`,
  category: "rekreativci",
}));

export const about = {
  title: "Iskustvo s pozornice, ne iz knjige",
  paragraphs: [
    "U sportu sam od svoje osme godine, a u teretanu sam prvi put ušao 2008. Već 2011. javljali su mi se prvi ljudi za plan treninga i prehrane i to je postao posao od kojeg živim.",
    "S natjecateljima sam osvojio sve što se u amaterskom bodybuildingu može osvojiti, a s rekreativcima napravio transformacije i u najtežim uvjetima. Danas sustav slažem tako da radi za svakoga, uz posao i obveze.",
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
    { year: "2024", text: "Predavač na Fitnes učilištu u Zagrebu" },
  ],
};

export const faq = [
  {
    q: "Koji paket je za mene?",
    a: "Ako želiš tjedno praćenje i stalne izmjene, uzmi online coaching. Ako želiš napredak bez velikog pritiska i check-in jednom mjesečno, paket 12 tjedana. Trenerima je namijenjen coaching i edukacija, a natjecateljima pripreme.",
  },
  {
    q: "Kako izgleda check-in?",
    a: "Pošalješ slike i podatke koje tražim, a ja na temelju njih postavim plan za sljedeće razdoblje. Kod online coachinga to je svakih 7 dana, a kod paketa 12 tjedana svaka 4 tjedna.",
  },
  {
    q: "Što ako zakasnim s check-inom?",
    a: "Ništa strašno. Razmak od 7 do 10 dana potpuno je u redu. Trenutni plan ne prestaje davati rezultate zato što je prošlo par dana više.",
  },
  {
    q: "Radiš li vikendom?",
    a: "Ne. Vikendom uglavnom nisam dostupan. Od ponedjeljka radim izmjene redom, kako su check-inovi stizali od subote.",
  },
  {
    q: "Moram li se odreći svega što volim?",
    a: "Ne. Sustav je napravljen tako da radi uz posao, obveze i društveni život. U upitniku navedeš navike kojih se ne želiš odreći i plan se slaže oko njih.",
  },
  {
    q: "Mogu li raditi s tobom ako nisam iz Hrvatske?",
    a: "Možeš. Sve se radi online, bez obzira na to gdje živiš. U upitniku samo navedeš državu iz koje ide uplata.",
  },
  {
    q: "Što trebam pripremiti za prijavu?",
    a: "Slike cijelog tijela, od glave do pete, uz dobro svjetlo i bez sjena. Uz to jutarnju kilažu i kratak opis treninga, prehrane i dnevne rutine.",
  },
  {
    q: "Što se dogodi kad pošaljem prijavu?",
    a: "Stigne ti potvrda na mail. Pregledam odgovore i slike, javim ti se s dogovorom oko početka i uplate, a nakon toga dobiješ početni plan.",
  },
];

export const instagramFallback = [
  { src: "/images/om-konstrukcija.jpg", alt: "Poza na čeličnoj konstrukciji" },
  { src: "/images/om-ledja.jpg", alt: "Trening u teretani" },
  { src: "/images/om-narandzasta.jpg", alt: "Fotografija ispred narančastog zida" },
  { src: "/images/om-portret.jpg", alt: "Prednja poza" },
  { src: "/images/om-ledja-krov.jpg", alt: "Poza leđa na krovu" },
  { src: "/images/om-majica.jpg", alt: "U teretani" },
];
