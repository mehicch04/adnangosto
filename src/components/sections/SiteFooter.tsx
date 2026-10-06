/*
  Podnožje: logo, Instagram i godina. Godina se računa sama,
  da 1. januara niko ne mora ništa mijenjati.
*/
import Image from "next/image";
import { InstagramIcon } from "@/components/ui/icons";
import { site } from "@/content/site";

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-brand-line px-5 py-10">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 sm:flex-row sm:justify-between">
        <Image
          src="/images/logo-ga.png"
          alt="Gosto Adnan"
          width={560}
          height={304}
          className="h-8 w-auto"
        />

        <a
          href={site.instagram}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex min-h-12 items-center gap-2 text-brand-muted transition-colors hover:text-brand-yellow"
        >
          <InstagramIcon />
          <span>{site.instagramHandle}</span>
        </a>

        <p className="text-sm text-brand-muted">
          © {year} {site.name}
        </p>
      </div>
    </footer>
  );
}
