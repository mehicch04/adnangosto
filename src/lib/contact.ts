import { site } from "@/content/site";

export type ContactLink = { href: string; label: string; kind: "whatsapp" | "instagram" };

export function contactLink(
  message = "Zdravo Adnane, imam pitanje u vezi coachinga.",
): ContactLink {
  if (site.whatsapp) {
    const number = site.whatsapp.replace(/[^\d]/g, "");
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
