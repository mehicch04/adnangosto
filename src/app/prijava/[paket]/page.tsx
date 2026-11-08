import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ApplicationForm } from "@/components/application/ApplicationForm";
import { formatPrice, getPackage, packages } from "@/content/packages";
import { site } from "@/content/site";

type Props = { params: Promise<{ paket: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return packages.map((p) => ({ paket: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { paket } = await params;
  const pkg = getPackage(paket);
  return {
    title: pkg ? `Prijava, ${pkg.name}` : "Prijava",
    description: pkg ? `Upitnik za prijavu: ${pkg.name}. ${pkg.checkIn}.` : undefined,
  };
}

export default async function ApplicationPage({ params }: Props) {
  const { paket } = await params;
  const pkg = getPackage(paket);
  if (!pkg) notFound();

  return (
    <>
      <header className="sticky top-0 z-30 border-b border-white/10 bg-brand-black/95">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-5 lg:h-20">
          <Link href="/" aria-label="Adnan Gosto, početna" className="shrink-0">
            <Image
              src="/images/logo-ga.png"
              alt="Gosto Adnan"
              width={129}
              height={70}
              priority
              className="h-9 w-auto lg:h-11"
            />
          </Link>
          <div className="flex items-center gap-4">
            <p className="hidden text-sm text-white/60 sm:block">
              Prijava za <span className="font-semibold text-white">{pkg.name}</span>
            </p>
            <Link
              href={`/paketi/${pkg.slug}`}
              className="inline-flex min-h-11 items-center gap-2 rounded-md border border-white/15 px-4 text-sm font-semibold text-white transition-colors hover:border-white/40"
            >
              <svg viewBox="0 0 16 16" aria-hidden="true" className="size-3.5">
                <path
                  d="m4 4 8 8m0-8-8 8"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
              Zatvori
            </Link>
          </div>
        </div>
      </header>
      <main id="sadrzaj" className="mx-auto max-w-6xl px-5 pt-8 pb-16 lg:pt-14 lg:pb-24">
        <div className="mb-8 lg:hidden">
          <p className="text-xs font-bold tracking-[0.18em] text-brand-yellow uppercase">
            Prijava za paket
          </p>
          <h1 className="mt-1 font-display text-4xl leading-none">{pkg.name}</h1>
          <p className="mt-2 text-sm text-white/65">
            <span className="font-semibold text-white">
              {formatPrice(pkg.price)} {pkg.priceUnit}
            </span>{" "}
            · Upitnik traje oko 10 minuta
          </p>
        </div>
        <div className="mb-10 hidden lg:block">
          <h1 className="font-display text-7xl leading-none">Prijava</h1>
          <p className="mt-3 text-white/60">
            Upitnik traje oko 10 minuta. Odgovori se čuvaju dok ne pošalješ prijavu.
          </p>
        </div>
        <ApplicationForm
          slug={pkg.slug}
          packageName={pkg.name}
          price={`${formatPrice(pkg.price)} ${pkg.priceUnit}`}
          checkIn={pkg.checkIn}
          backHref={`/paketi/${pkg.slug}`}
          instagram={site.instagram}
        />
      </main>
    </>
  );
}
