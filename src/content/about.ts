export type Result = {
  place: number | "Pro";
  event: string;
  category?: string;
  location?: string;
  overall?: boolean;
  note?: string;
};

export const profileFacts = [
  { value: "2011", label: "online coaching" },
  { value: "2012", label: "prvi nastup na bini" },
  { value: "2021", label: "IFBB Pro Card" },
  { value: "2024", label: "predavač u Zagrebu" },
];

export const story = [
  "Zovem se Adnan Gosto i dolazim iz Mostara. U sportu sam od svoje osme godine, a u teretanu sam prvi put ušao 2008. Znanje sam usvajao brzo i bio sam administrator na više regionalnih fitness foruma, hrvatskim, srpskim i bosanskim.",
  "Već 2011. su mi se počeli javljati prvi ljudi i tražiti pomoć oko treninga i prehrane. To sam ubrzo pretvorio u posao i od tada radim online coaching.",
  "Brze promjene na tijelu probudile su volju, inat i disciplinu. Taj način života mi je s vremenom promijenio pogled na sve, od rada do odnosa prema ljudima. Naučio me upornosti i stalnoj gladi za napretkom.",
  "Godine 2012. sam prvi put stao na binu i od samog starta postao apsolutni prvak države, više godina zaredom, pa i balkanski prvak. Onda sam krenuo na internacionalnu scenu. Takmičio sam se kao profesionalac u dvije federacije i bio sam prvi i jedini profesionalni takmičar iz BiH u open kategoriji.",
  "Krajem 2015. preselio sam se u Zagreb, bliže ljudima i trenerima čije znanje i iskustvo daleko nadilaze ono što je dostupno na Balkanu. Radio sam s četvoricom najboljih trenera na svijetu, a znanje sam prenosio dalje kroz seminare i predavanja. Od 2024. sam i predavač na fitness učilištu u Zagrebu.",
  "S takmičarima sam osvojio sve što se u amaterskom bodybuildingu moglo osvojiti, ali me rad s rekreativcima najviše odredio. Većini ljudi teretana nije prioritet, i baš zato sam napravio sistem koji radi za svakoga, onoliko koliko se želi posvetiti.",
];

export const quote = {
  text: "Znanje je danas dostupno svima. Iskustvo je nešto na šta potrošiš godine, ili ti ga prenese neko ko je godinama ispred tebe.",
  author: "Adnan Gosto",
};

export const careerStats = [
  { value: "19", label: "zlatnih medalja" },
  { value: "3", label: "srebrne" },
  { value: "2", label: "bronzane" },
  { value: "4×", label: "zaredom apsolutni prvak BiH" },
];

export const resultsByYear: { year: string; highlight?: string; results: Result[] }[] = [
  {
    year: "2021",
    highlight: "IFBB Pro Card",
    results: [
      {
        place: 1,
        event: "Fit Parade, IFBB Pro Qualifier",
        category: "do 102 kg",
        location: "Budimpešta, Mađarska",
        overall: true,
        note: "Osvojena IFBB Pro Card",
      },
      {
        place: 2,
        event: "Austrian Oak, IFBB Pro Qualifier",
        category: "do 102 kg",
        location: "St. Pölten, Austrija",
      },
      {
        place: "Pro",
        event: "Romania Muscle Fest Pro",
        location: "Bukurešt, Rumunija",
        note: "Debi u IFBB Pro ligi",
      },
    ],
  },
  {
    year: "2018",
    highlight: "Elite Pro",
    results: [
      { place: "Pro", event: "IFBB Elite Pro liga", note: "Osvojena Elite Pro Card i pro debi" },
    ],
  },
  {
    year: "2016",
    results: [
      {
        place: 1,
        event: "Balkansko prvenstvo",
        category: "do 90 kg",
        location: "Knjaževac, Srbija",
      },
    ],
  },
  {
    year: "2015",
    results: [
      {
        place: 1,
        event: "Državno prvenstvo BiH",
        category: "do 90 kg",
        location: "Tomislavgrad",
        overall: true,
      },
      { place: 1, event: "Bihać Open", category: "do 90 kg", location: "Bihać", overall: true },
      {
        place: 5,
        event: "Mr. Olympia Amateur Spain",
        category: "do 90 kg",
        location: "Malaga, Španija",
      },
    ],
  },
  {
    year: "2014",
    results: [
      {
        place: 1,
        event: "Državno prvenstvo BiH",
        category: "do 90 kg",
        location: "Jelah",
        overall: true,
      },
      { place: 1, event: "Srbija Open", category: "do 90 kg", location: "Beograd" },
      { place: 1, event: "Bihać Open", category: "do 90 kg", location: "Bihać", overall: true },
      { place: 2, event: "Balkansko prvenstvo", category: "do 90 kg", location: "Zaječar, Srbija" },
    ],
  },
  {
    year: "2013",
    results: [
      {
        place: 1,
        event: "Državno prvenstvo BiH",
        category: "do 90 kg",
        location: "Sanski Most",
        overall: true,
      },
      { place: 1, event: "Srbija Open", category: "do 90 kg", location: "Beograd", overall: true },
      { place: 2, event: "Bihać Open", category: "do 90 kg", location: "Bihać" },
    ],
  },
  {
    year: "2012",
    results: [
      {
        place: 1,
        event: "Državno prvenstvo BiH",
        category: "do 80 kg",
        location: "Cazin",
        overall: true,
      },
      { place: 1, event: "Bihać Open", category: "do 80 kg", location: "Bihać", overall: true },
      { place: 3, event: "Balkansko prvenstvo", category: "do 80 kg", location: "Čačak, Srbija" },
      { place: 3, event: "Memorijalni turnir Fuad Ahmetkadić Fuke", category: "do 80 kg" },
    ],
  },
];

export const mentors = [
  { name: "Patrick Tuor", origin: "Velikan bodybuilding scene" },
  { name: "Ahmad Askar", origin: "Kuvajt" },
  { name: "Mauro Sassi", origin: "Italija" },
];

export const coachingHighlights = [
  { value: "77+", label: "zlata" },
  { value: "56", label: "srebra" },
  { value: "26", label: "bronzi" },
  { value: "4", label: "Elite Pro karte" },
];

export const coachingTitles = [
  "4 pro karte s takmičarima",
  "Pobjeda na svjetskom prvenstvu",
  "Pobjeda na evropskom prvenstvu",
  "Apsolutni pobjednik Arnold Classic Barcelona",
];

export const gallery = [
  {
    src: "/images/om-konstrukcija.jpg",
    alt: "Adnan Gosto pozira na čeličnoj konstrukciji",
    w: 1201,
    h: 1800,
  },
  {
    src: "/images/om-narandzasta.jpg",
    alt: "Adnan Gosto ispred narandžastog zida",
    w: 1800,
    h: 1632,
  },
  { src: "/images/om-ledja-krov.jpg", alt: "Poza leđa na krovu", w: 1144, h: 1800 },
  { src: "/images/om-ledja.jpg", alt: "Trening u teretani", w: 1196, h: 1800 },
  { src: "/images/om-portret.jpg", alt: "Prednja poza", w: 1201, h: 1800 },
  { src: "/images/om-sjedi.jpg", alt: "Poza na otvorenom", w: 1800, h: 1202 },
  { src: "/images/om-bocno.jpg", alt: "Bočna poza", w: 1159, h: 1800 },
];
