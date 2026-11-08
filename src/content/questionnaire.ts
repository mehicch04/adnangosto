import type { PackageSlug } from "@/content/packages";

export type FieldType =
  "text" | "email" | "tel" | "number" | "date" | "textarea" | "radio" | "chips" | "country";

export type Field = {
  id: string;
  label: string;
  type: FieldType;
  required?: boolean;
  help?: string;
  placeholder?: string;
  options?: string[];
  min?: number;
  max?: number;
  maxLength?: number;
  rows?: number;
  autoComplete?: string;
  inputMode?: "numeric" | "decimal" | "tel" | "email" | "text";
  suffix?: string;
  showIf?: { field: string; equals: string };
  half?: boolean;
};

export type Step = {
  id: string;
  title: string;
  short: string;
  intro?: string;
  fields: Field[];
  kind?: "photos" | "review";
};

export const countries = [
  "Bosna i Hercegovina",
  "Hrvatska",
  "Srbija",
  "Crna Gora",
  "Slovenija",
  "Sjeverna Makedonija",
  "Austrija",
  "Njemačka",
  "Švicarska",
  "Švedska",
  "SAD",
];

export const photoRules = [
  "Cijelo tijelo na slici, od glave do pete. Selfiji i djelimično slikano tijelo se ne priznaju.",
  "Dobro svjetlo. Izvor svjetla ne smije biti iza tebe.",
  "Bez sjenki po tijelu i bez jakog svjetla koje direktno udara u tijelo.",
  "Svaki put slikaj na istom mjestu, da se napredak može uporediti.",
];

export const PHOTO_MIN = 1;
export const PHOTO_MAX = 6;

const contact: Step = {
  id: "kontakt",
  title: "Osnovni podaci",
  short: "Podaci",
  intro: "Na ovaj mail ti stiže potvrda prijave i moj odgovor.",
  fields: [
    {
      id: "fullName",
      label: "Ime i prezime",
      type: "text",
      required: true,
      autoComplete: "name",
      maxLength: 120,
    },
    {
      id: "email",
      label: "E-mail",
      type: "email",
      required: true,
      autoComplete: "email",
      inputMode: "email",
      maxLength: 160,
    },
    {
      id: "phone",
      label: "Telefon ili WhatsApp",
      type: "tel",
      autoComplete: "tel",
      inputMode: "tel",
      placeholder: "+387 6x xxx xxx",
      maxLength: 30,
      half: true,
    },
    {
      id: "instagram",
      label: "Instagram",
      type: "text",
      placeholder: "@korisnicko.ime",
      maxLength: 60,
      half: true,
    },
    {
      id: "country",
      label: "Država iz koje ide uplata",
      type: "country",
      required: true,
      autoComplete: "country-name",
      maxLength: 80,
    },
  ],
};

const body = (goalsExtra: Field[] = []): Step => ({
  id: "cilj",
  title: "Tijelo i cilj",
  short: "Cilj",
  fields: [
    {
      id: "weight",
      label: "Jutarnja kilaža",
      type: "number",
      required: true,
      inputMode: "decimal",
      min: 30,
      max: 250,
      suffix: "kg",
      help: "Izmjeri se ujutro, nakon toaleta, prije jela i pića.",
      half: true,
    },
    {
      id: "trainingDays",
      label: "Broj treninga sedmično s kojim želiš krenuti",
      type: "radio",
      required: true,
      options: ["2", "3", "4", "5", "6"],
      half: true,
    },
    ...goalsExtra,
    {
      id: "goals",
      label: "Konkretni ciljevi",
      type: "textarea",
      required: true,
      rows: 4,
      maxLength: 2000,
      placeholder:
        "Npr. skinuti 10 kg do ljeta, izgraditi mišićnu masu, više energije tokom dana...",
    },
  ],
});

const training: Step = {
  id: "trening",
  title: "Trening i prehrana",
  short: "Trening",
  intro: "Dovoljno je ukratko. Ako nešto ne radiš, slobodno napiši da ne radiš.",
  fields: [
    {
      id: "trainingPlan",
      label: "Trenutni plan treninga",
      type: "textarea",
      required: true,
      rows: 4,
      maxLength: 2000,
      help: "Podjela po mišićnim skupinama, koliko puta sedmično, kako treniraš.",
    },
    {
      id: "nutrition",
      label: "Trenutna prehrana",
      type: "textarea",
      required: true,
      rows: 4,
      maxLength: 2000,
      help: "Šta jedeš tokom dana, navike i sve specifičnosti, npr. intolerancije na određene namirnice.",
    },
    {
      id: "supplements",
      label: "Suplementacija",
      type: "textarea",
      required: true,
      rows: 3,
      maxLength: 1500,
      placeholder: "Npr. protein, kreatin, vitamin D... ili ne koristim ništa",
    },
  ],
};

const aas: Field[] = [
  {
    id: "aas",
    label: "Koristiš li AAS?",
    type: "radio",
    required: true,
    options: ["Ne", "Da"],
    help: "Ovaj podatak vidim samo ja i potreban mi je da plan bude siguran.",
  },
  {
    id: "aasDetails",
    label: "Šta tačno, koliko dugo i u kojim količinama?",
    type: "textarea",
    required: true,
    rows: 3,
    maxLength: 1500,
    showIf: { field: "aas", equals: "Da" },
  },
];

const health = (withAas: boolean): Step => ({
  id: "zdravlje",
  title: "Zdravlje i dnevna rutina",
  short: "Rutina",
  fields: [
    {
      id: "health",
      label: "Zdravstveno stanje",
      type: "textarea",
      rows: 3,
      maxLength: 1500,
      help: "Sve što trebam znati: povrede, dijagnoze, terapija. Ako nema ništa, ostavi prazno.",
    },
    {
      id: "routine",
      label: "Dnevna rutina",
      type: "textarea",
      required: true,
      rows: 5,
      maxLength: 2000,
      help: "Buđenje, posao ili škola, vrijeme treninga i odlazak na spavanje. Ako radiš u smjenama, navedi raspored za svaku smjenu.",
    },
    ...(withAas ? aas : []),
  ],
});

const photos: Step = {
  id: "slike",
  title: "Slike",
  short: "Slike",
  kind: "photos",
  intro: "Slika mi je glavna vodilja u procesu. Što realnije stanje vidim, to bolji plan dobiješ.",
  fields: [],
};

const review: Step = {
  id: "pregled",
  title: "Pregled i slanje",
  short: "Slanje",
  kind: "review",
  fields: [],
};

const twelveWeeks: Field[] = [
  {
    id: "focus",
    label: "Šta prvenstveno želiš poboljšati?",
    type: "chips",
    required: true,
    options: [
      "Smanjiti tjelesnu težinu",
      "Izgraditi mišiće",
      "Ojačati",
      "Biti vitalniji i pokretniji",
      "Kardiovaskularni sistem",
    ],
  },
  {
    id: "habits",
    label: "Navike kojih se ne želiš odreći",
    type: "textarea",
    rows: 3,
    maxLength: 1500,
    placeholder: "Npr. izlasci vikendom, slatko poslije ručka, kafa s mlijekom...",
    help: "Plan slažem oko njih, zato slobodno napiši sve.",
  },
];

const education: Step = {
  id: "edukacija",
  title: "Edukacija",
  short: "Edukacija",
  fields: [
    {
      id: "subject",
      label: "Na kome radimo transformaciju?",
      type: "radio",
      required: true,
      options: ["Na meni", "Na mom klijentu"],
      help: "Ako radimo na klijentu, u narednim koracima upiši podatke o njemu.",
    },
    {
      id: "segment",
      label: "Koji segment te više zanima?",
      type: "radio",
      required: true,
      options: ["Trening", "Prehrana", "Oboje podjednako"],
    },
  ],
};

const competition: Step = {
  id: "takmicenje",
  title: "Takmičenje",
  short: "Takmičenje",
  intro: "Pripremu slažem prema datumu i tačnom broju sedmica koje imamo na raspolaganju.",
  fields: [
    {
      id: "competition",
      label: "Takmičenje",
      type: "text",
      required: true,
      maxLength: 160,
      placeholder: "Naziv takmičenja i kategorija",
    },
    {
      id: "competitionDate",
      label: "Datum takmičenja",
      type: "date",
      required: true,
    },
    {
      id: "experience",
      label: "Dosadašnje iskustvo s takmičarskim bodybuildingom",
      type: "textarea",
      required: true,
      rows: 4,
      maxLength: 2000,
      placeholder:
        "Na kojim takmičenjima si nastupao, plasmani, kategorije... ili da ti je ovo prvi put",
    },
    {
      id: "posing",
      label: "Treba li ti pomoć s pozingom?",
      type: "radio",
      required: true,
      options: ["Da", "Ne", "Ne znam još"],
    },
  ],
};

export const questionnaires: Record<PackageSlug, Step[]> = {
  "online-coaching": [contact, body(), training, health(true), photos, review],
  "paket-12-sedmica": [contact, body(twelveWeeks), training, health(false), photos, review],
  "coaching-i-edukacija": [contact, education, body(), training, health(true), photos, review],
  "takmicarske-pripreme": [contact, competition, body(), training, health(true), photos, review],
};

export type Answers = Record<string, string | string[]>;

export function isVisible(field: Field, values: Answers) {
  if (!field.showIf) return true;
  return values[field.showIf.field] === field.showIf.equals;
}

const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const phoneRe = /^[+\d\s()/.-]{6,30}$/;

export function validateField(field: Field, raw: string | string[] | undefined): string | null {
  if (field.type === "chips") {
    const list = Array.isArray(raw) ? raw : [];
    if (field.required && list.length === 0) return "Izaberi barem jednu opciju.";
    if (list.some((v) => !field.options?.includes(v))) return "Neispravan odabir.";
    return null;
  }
  const value = typeof raw === "string" ? raw.trim() : "";
  if (!value) return field.required ? "Ovo polje je obavezno." : null;
  if (field.maxLength && value.length > field.maxLength)
    return `Najviše ${field.maxLength} znakova.`;
  if (field.type === "email" && !emailRe.test(value)) return "Upiši ispravan e-mail.";
  if (field.type === "tel" && !phoneRe.test(value)) return "Upiši ispravan broj telefona.";
  if (field.type === "number") {
    const n = Number(value.replace(",", "."));
    if (!Number.isFinite(n)) return "Upiši broj.";
    if (field.min !== undefined && n < field.min) return `Najmanje ${field.min}.`;
    if (field.max !== undefined && n > field.max) return `Najviše ${field.max}.`;
  }
  if (field.type === "radio" && field.options && !field.options.includes(value))
    return "Izaberi jednu od ponuđenih opcija.";
  if (field.type === "date") {
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return "Upiši ispravan datum.";
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (d < today) return "Datum takmičenja ne može biti u prošlosti.";
  }
  return null;
}

export function validateStep(step: Step, values: Answers) {
  const errors: Record<string, string> = {};
  for (const field of step.fields) {
    if (!isVisible(field, values)) continue;
    const error = validateField(field, values[field.id]);
    if (error) errors[field.id] = error;
  }
  return errors;
}

export function weeksUntil(date: string) {
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return null;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return Math.floor((d.getTime() - today.getTime()) / (7 * 24 * 60 * 60 * 1000));
}
