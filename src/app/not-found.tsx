import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Stranica nije pronađena",
};

export default function NotFound() {
  return (
    <main className="grid min-h-[100svh] place-items-center px-5 text-center">
      <div>
        <p className="font-display text-[9rem] leading-none text-brand-yellow">404</p>
        <h1 className="mt-2 font-display text-5xl">Stranica nije pronađena</h1>
        <p className="mx-auto mt-4 max-w-sm text-white/65">
          Link je možda pogrešan ili stranica više ne postoji.
        </p>
        <Link
          href="/"
          className="mt-8 inline-flex min-h-12 items-center rounded-sm bg-brand-yellow px-7 text-[13px] font-bold tracking-[0.14em] text-brand-black uppercase transition-colors hover:bg-white"
        >
          Nazad na početnu
        </Link>
      </div>
    </main>
  );
}
