/*
  Resend klijent za slanje mailova.
  Samo server: API kljuc nikad ne smije u preglednik.

  Dva maila po prijavi:
    1. Adnanu: "Klasični coaching, prijava" + svi odgovori
    2. Podnosiocu: potvrda da je prijava zaprimljena

  Sablone mailova pravimo u sedmici 2, kad bude gotov upitnik.
*/
import "server-only";
import { Resend } from "resend";

export const resend = new Resend(process.env.RESEND_API_KEY);

export const EMAIL_FROM = process.env.EMAIL_FROM ?? "Adnan Gosto <onboarding@resend.dev>";
export const APPLICATIONS_TO = process.env.APPLICATIONS_TO_EMAIL ?? "";
