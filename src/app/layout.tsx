import type { Metadata, Viewport } from "next";
// next/font skida fontove pri buildu i servira ih s tvog domena.
// Nema poziva prema Googleu u pregledniku, pa ne pada PageSpeed ocjena.
import { Bebas_Neue, Barlow } from "next/font/google";
import "./globals.css";

// Bebas Neue: uski masni naslovi, kao na njegovim objavama. Ima samo tezinu 400.
const bebas = Bebas_Neue({
  weight: "400",
  subsets: ["latin", "latin-ext"], // latin-ext je OBAVEZAN zbog č, ć, š, ž, đ
  variable: "--font-bebas",
  display: "swap", // tekst se prikaze odmah, font se zamijeni kad stigne
});

// Barlow: tekst. 400 za obican, 600 za podebljan. Svaka tezina vise = veci fajl.
const barlow = Barlow({
  weight: ["400", "600"],
  subsets: ["latin", "latin-ext"],
  variable: "--font-barlow",
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  // metadataBase: iz ovoga Next pravi pune linkove za Open Graph slike
  metadataBase: new URL(siteUrl),
  title: {
    default: "Adnan Gosto",
    template: "%s | Adnan Gosto",
  },
  description:
    "Online coaching, priprema takmičara i edukacija za trenere. Prijavite se kroz kratak upitnik.",
  openGraph: {
    type: "website",
    locale: "bs_BA",
    siteName: "Adnan Gosto",
  },
};

// Boja trake preglednika na mobitelu, da se stopi s crnom pozadinom.
export const viewport: Viewport = {
  themeColor: "#0a0a0a",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // Obje font varijable idu na <html> da budu dostupne svuda ispod.
    <html
      lang="bs"
      data-scroll-behavior="smooth"
      className={`${bebas.variable} ${barlow.variable}`}
    >
      <body className="bg-brand-black text-brand-white antialiased">{children}</body>
    </html>
  );
}
