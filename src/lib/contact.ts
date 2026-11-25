import "server-only";
import { site } from "@/content/site";
import { getTexts } from "@/lib/content/texts";

export type ContactLink = { href: string; label: string; kind: "whatsapp" | "instagram" };

const DEFAULT_MESSAGE = "Bok Adnane, imam pitanje vezano uz coaching.";

export function buildContactLink(whatsapp: string, message = DEFAULT_MESSAGE): ContactLink {
  const number = whatsapp.replace(/[^\d]/g, "");
  if (number.length >= 8) {
    return {
      href: `https://wa.me/${number}?text=${encodeURIComponent(message)}`,
      label: "WhatsApp",
      kind: "whatsapp",
    };
  }
  return {
    href: `https://ig.me/m/${site.instagramHandle.replace("@", "")}`,
    label: "Instagram",
    kind: "instagram",
  };
}

export async function contactLink(message = DEFAULT_MESSAGE): Promise<ContactLink> {
  const { contact } = await getTexts();
  return buildContactLink(contact.whatsapp, message);
}
