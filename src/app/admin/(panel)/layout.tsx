import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { signOut } from "@/app/admin/actions";

export const metadata: Metadata = {
  title: "Panel",
  robots: { index: false, follow: false },
};

export default function PanelLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <header className="sticky top-0 z-30 border-b border-white/10 bg-brand-black/95">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-5">
          <div className="flex items-center gap-6">
            <Link href="/admin" aria-label="Panel, prijave">
              <Image
                src="/images/logo-ga.png"
                alt="Gosto Adnan"
                width={129}
                height={70}
                className="h-9 w-auto"
              />
            </Link>
            <nav className="flex items-center gap-1 text-sm font-semibold">
              <Link
                href="/admin"
                className="rounded-md px-3 py-2 text-white hover:bg-brand-surface"
              >
                Prijave
              </Link>
              <Link
                href="/"
                className="rounded-md px-3 py-2 text-white/60 hover:bg-brand-surface hover:text-white"
              >
                Sajt
              </Link>
            </nav>
          </div>
          <form action={signOut}>
            <button
              type="submit"
              className="min-h-10 rounded-md border border-white/15 px-4 text-sm font-semibold text-white/80 transition-colors hover:border-white/40 hover:text-white"
            >
              Odjava
            </button>
          </form>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-5 py-10 lg:py-14">{children}</main>
    </>
  );
}
