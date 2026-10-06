/*
  Zod shema za prijavu iz upitnika.

  Zasto Zod: TypeScript tipovi postoje samo dok pises kod. Kad forma stigne
  na server, to je obican tekst koji je neko mogao i izmisliti.
  Zod ga PROVJERI u trenutku izvrsavanja i tek onda kaze "ovo je sigurno".

  Bonus: iz iste sheme dobijamo i TypeScript tip (z.infer), pa se forma,
  validacija i baza nikad ne razilaze.
*/
import { z } from "zod";

// Jedan odgovor na jedno pitanje. Pamtimo i tekst pitanja (snimak),
// jer Adnan moze kasnije promijeniti pitanje, a stara prijava mora ostati citljiva.
export const answerSchema = z.object({
  questionId: z.uuid(),
  question: z.string().min(1),
  answer: z.string().trim().max(2000, "Odgovor je predugačak"),
});

export const applicationSchema = z.object({
  packageSlug: z.string().min(1),

  fullName: z.string().trim().min(2, "Upiši ime i prezime").max(120),
  email: z.email("Upiši ispravan email"),
  // telefon nije obavezan, ali ako je upisan mora liciti na broj
  phone: z
    .string()
    .trim()
    .regex(/^[+\d\s()-]{6,20}$/, "Upiši ispravan broj telefona")
    .optional()
    .or(z.literal("")),

  answers: z.array(answerSchema).max(50),

  // Mamac za botove: skriveno polje koje covjek nikad ne vidi ni ne popuni.
  // Ako stigne popunjeno, prijavu tiho odbacujemo. Besplatna zastita od spama.
  website: z.string().max(0).optional(),
});

// Tip izveden iz sheme. Koristi ga u formi i u server actionu.
export type ApplicationInput = z.infer<typeof applicationSchema>;
