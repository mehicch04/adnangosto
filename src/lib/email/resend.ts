import "server-only";
import { Resend } from "resend";
import { ADNAN_EMAIL } from "@/content/packages";

const key = process.env.RESEND_API_KEY;

export const resend = key && !key.includes("xxxx") ? new Resend(key) : null;
export const EMAIL_FROM = process.env.EMAIL_FROM ?? "Adnan Gosto <onboarding@resend.dev>";
export const APPLICATIONS_TO =
  process.env.APPLICATIONS_TO_EMAIL && !process.env.APPLICATIONS_TO_EMAIL.includes("example.com")
    ? process.env.APPLICATIONS_TO_EMAIL
    : ADNAN_EMAIL;
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
