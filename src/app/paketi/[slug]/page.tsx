import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteHeader } from "@/components/sections/SiteHeader";
import { SiteFooter } from "@/components/sections/SiteFooter";
import { Transformations } from "@/components/sections/Transformations";
import { ClientResults } from "@/components/sections/ClientResults";
import { StickyCta } from "@/components/packages/StickyCta";
import { ChatButton } from "@/components/sections/ChatButton";
import { contactLink } from "@/lib/contact";
import { ArrowRightIcon, InstagramIcon, TickIcon, WhatsAppIcon } from "@/components/ui/icons";
import { formatPrice, packages } from "@/content/packages";
import { getPackage, getPackages } from "@/lib/content/packages";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return packages.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const pkg = await getPackage(slug);
  if (!pkg) return {};
  return {
    title: pkg.name,
    description: `${pkg.tagline} ${formatPrice(pkg.price)} ${pkg.priceUnit}. ${pkg.checkIn}.`,
    alternates: { canonical: `/paketi/${pkg.slug}` },
    openGraph: { title: `${pkg.name} | Adnan Gosto`, description: pkg.tagline },
  };
}

export default async function PackagePage({ params }: Props) {
  const { slug } = await params;
  const pkg = await getPackage(slug);
  if (!pkg) notFound();

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const apply = `/prijava/${pkg.slug}`;
  const others = (await getPackages()).filter((p) => p.slug !== pkg.slug);
  const chat = contactLink(`Zdravo Adnane, imam pitanje u vezi paketa ${pkg.name}.`);
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "Service",
      name: pkg.name,
      description: pkg.tagline,
      serviceType: "Online coaching",
      areaServed: "Europe",
      provider: { "@type": "Person", name: "Adnan Gosto", url: siteUrl },
      offers: {
        "@type": "Offer",
        price: pkg.price,
        priceCurrency: "EUR",
        url: `${siteUrl}/paketi/${pkg.slug}`,
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Početna", item: siteUrl },
        { "@type": "ListItem", position: 2, name: "Paketi", item: `${siteUrl}/#saradnja` },
        { "@type": "ListItem", position: 3, name: pkg.name, item: `${siteUrl}/paketi/${pkg.slug}` },
      ],
    },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      <a
        href="#sadrzaj"
        className="sr-only z-50 rounded bg-brand-yellow px-4 py-2 font-semibold text-brand-black focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
      >
        Preskoči na sadržaj
      </a>
      <SiteHeader />
      <main id="sadrzaj">
        <section className="relative isolate overflow-hidden px-5 pt-28 pb-16 lg:pt-40 lg:pb-24">
          <div
            aria-hidden="true"
            className="absolute inset-x-0 top-0 -z-10 h-[60%] bg-gradient-to-b from-brand-surface to-transparent"
          />
          <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:gap-x-16 lg:gap-y-0">
            <div className="animate-rise">
              <nav aria-label="Putanja" className="text-sm text-white/55">
                <ol className="flex flex-wrap items-center gap-2">
                  <li>
                    <Link href="/" className="hover:text-white">
                      Početna
                    </Link>
                  </li>
                  <li aria-hidden="true">/</li>
                  <li>
                    <Link href="/#saradnja" className="hover:text-white">
                      Paketi
                    </Link>
                  </li>
                  <li aria-hidden="true">/</li>
                  <li aria-current="page" className="text-white/85">
                    {pkg.name}
                  </li>
                </ol>
              </nav>
              {pkg.badge && (
                <p className="mt-8 inline-block rounded-sm bg-brand-yellow px-2.5 py-1 text-xs font-bold tracking-[0.14em] text-brand-black uppercase">
                  {pkg.badge}
                </p>
              )}
              <h1
                className={`${pkg.badge ? "mt-4" : "mt-8"} font-display text-[clamp(3.75rem,11vw,8.5rem)] leading-[0.85]`}
              >
                {pkg.name}
              </h1>
              <p className="mt-6 max-w-xl text-xl text-white/85">{pkg.tagline}</p>
              <p className="mt-3 max-w-xl text-white/60">{pkg.audience}</p>
            </div>

            <aside className="lg:row-span-2 lg:pt-10">
              <div className="animate-rise overflow-hidden rounded-lg border border-brand-line bg-brand-surface [animation-delay:120ms] lg:sticky lg:top-28">
                <div className="relative aspect-[16/10]">
                  <Image
                    src={pkg.image}
                    alt="Adnan Gosto"
                    fill
                    priority
                    sizes="(min-width: 1024px) 480px, 100vw"
                    className="object-cover object-[50%_25%]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-surface via-brand-surface/20 to-transparent" />
                </div>
                <div className="p-6 sm:p-8">
                  <p className="flex items-baseline gap-2">
                    <span className="font-display text-7xl leading-none">
                      {formatPrice(pkg.price)}
                    </span>
                    <span className="font-semibold text-white/65">{pkg.priceUnit}</span>
                  </p>
                  <dl className="mt-6 divide-y divide-brand-line border-y border-brand-line text-[15px]">
                    <div className="flex justify-between gap-4 py-3">
                      <dt className="text-white/55">Praćenje</dt>
                      <dd className="text-right font-semibold">{pkg.checkIn}</dd>
                    </div>
                    <div className="flex justify-between gap-4 py-3">
                      <dt className="text-white/55">Plaćanje</dt>
                      <dd className="text-right font-semibold">{pkg.priceNote}</dd>
                    </div>
                    <div className="flex justify-between gap-4 py-3">
                      <dt className="text-white/55">Način rada</dt>
                      <dd className="text-right font-semibold">Online, bilo gdje</dd>
                    </div>
                  </dl>
                  <Link
                    id="paket-cta"
                    href={apply}
                    className="group mt-7 flex min-h-14 items-center justify-center gap-2 rounded-md bg-brand-yellow px-6 text-lg font-bold text-brand-black transition-colors hover:bg-[#f5c24a]"
                  >
                    Prijavi se za ovaj paket
                    <ArrowRightIcon className="size-5 transition-transform group-hover:translate-x-1" />
                  </Link>
                  <p className="mt-4 text-center text-sm text-white/55">
                    Upitnik traje oko 10 minuta. Prijava te ni na šta ne obavezuje.
                  </p>
                  <a
                    href={chat.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-5 flex min-h-12 items-center justify-center gap-2.5 rounded-md border border-white/15 px-5 text-[15px] font-semibold text-white transition-colors hover:border-white/40"
                  >
                    {chat.kind === "whatsapp" ? (
                      <WhatsAppIcon className="size-5 text-[#25D366]" />
                    ) : (
                      <InstagramIcon className="size-5" />
                    )}
                    Imaš pitanje? Piši mi na {chat.label}
                  </a>
                </div>
              </div>
            </aside>
            <div className="animate-rise [animation-delay:200ms]">
              <h2 className="text-xs font-bold tracking-[0.2em] text-brand-yellow uppercase lg:mt-12">
                Za tebe je ako
              </h2>
              <ul className="mt-5 space-y-4">
                {pkg.forWho.map((f) => (
                  <li key={f} className="flex gap-4 text-lg text-white/85">
                    <span className="mt-1 grid size-6 shrink-0 place-items-center rounded-full bg-brand-yellow text-brand-black">
                      <TickIcon className="size-3.5" />
                    </span>
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section className="border-t border-brand-line px-5 py-20 lg:py-28">
          <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
            <div>
              <h2 className="font-display text-6xl leading-[0.88] sm:text-7xl">
                Šta <span className="text-brand-yellow">dobijaš</span>
              </h2>
              {pkg.intro.map((p) => (
                <p key={p.slice(0, 30)} className="mt-6 max-w-md text-lg text-white/70">
                  {p}
                </p>
              ))}
            </div>
            <ul className="grid gap-px overflow-hidden rounded-lg border border-brand-line bg-brand-line sm:grid-cols-2">
              {pkg.includes.map((item, i) => (
                <li
                  key={item.title}
                  className="reveal bg-brand-black p-6 transition-colors duration-300 hover:bg-brand-surface lg:p-8"
                >
                  <span className="font-display text-4xl leading-none text-brand-yellow">
                    0{i + 1}
                  </span>
                  <h3 className="mt-4 text-xl font-semibold">{item.title}</h3>
                  <p className="mt-2 text-white/65">{item.text}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="bg-brand-paper px-5 py-20 text-brand-black lg:py-28">
          <div className="mx-auto max-w-7xl">
            <h2 className="font-display text-6xl leading-[0.88] sm:text-7xl">
              Kako izgleda saradnja
            </h2>
            <ol className="relative mt-14 grid gap-10 md:grid-cols-4 md:gap-6">
              <span
                aria-hidden="true"
                className="absolute top-6 right-[12%] left-[12%] hidden h-0.5 bg-brand-black/15 md:block"
              />
              <span
                aria-hidden="true"
                className="absolute top-6 bottom-6 left-6 w-0.5 bg-brand-black/15 md:hidden"
              />
              {pkg.steps.map((s, i) => (
                <li
                  key={s.title}
                  className="reveal relative grid grid-cols-[3rem_1fr] gap-5 md:block md:text-center"
                >
                  <span className="relative z-10 grid size-12 place-items-center rounded-full bg-brand-black font-display text-2xl text-brand-yellow md:mx-auto">
                    {i + 1}
                  </span>
                  <div className="md:mt-6">
                    <h3 className="text-xl font-semibold">{s.title}</h3>
                    <p className="mt-2 text-brand-ink-muted md:mx-auto md:max-w-[16rem]">
                      {s.text}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {pkg.why && (
          <section className="px-5 py-20 lg:py-28">
            <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
              <h2 className="font-display text-5xl leading-[0.9] sm:text-6xl lg:text-7xl">
                {pkg.why.title}
              </h2>
              <div className="border-l-2 border-brand-yellow pl-6 lg:pl-10">
                {pkg.why.paragraphs.map((p) => (
                  <p
                    key={p.slice(0, 30)}
                    className="mt-5 text-lg leading-relaxed text-white/75 first:mt-0"
                  >
                    {p}
                  </p>
                ))}
                <p className="mt-6 font-display text-2xl text-brand-yellow">Adnan Gosto</p>
              </div>
            </div>
          </section>
        )}

        <section
          className={`${pkg.why ? "" : "border-t border-brand-line"} px-5 pb-20 lg:pb-28 ${pkg.why ? "" : "pt-20 lg:pt-28"}`}
        >
          <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-2">
            <div className="rounded-lg border border-brand-line bg-brand-surface p-6 sm:p-8">
              <h2 className="flex items-center gap-3 text-xs font-bold tracking-[0.2em] text-brand-yellow uppercase">
                <svg viewBox="0 0 20 20" aria-hidden="true" className="size-5 fill-current">
                  <path d="M10 1.5a8.5 8.5 0 1 0 0 17 8.5 8.5 0 0 0 0-17Zm-.9 4h1.8v1.8H9.1V5.5Zm0 3.5h1.8v5.5H9.1V9Z" />
                </svg>
                Dobro je znati
              </h2>
              <ul className="mt-5 space-y-4">
                {pkg.notes.map((n) => (
                  <li key={n} className="flex gap-3 text-white/80">
                    <span className="mt-2.5 h-0.5 w-4 shrink-0 bg-brand-yellow" />
                    {n}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="text-xs font-bold tracking-[0.2em] text-brand-yellow uppercase">
                Pitanja o paketu
              </h2>
              <div className="mt-3 border-t border-brand-line">
                {pkg.faq.map((f) => (
                  <details key={f.q} className="faq-item group border-b border-brand-line">
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-5 [&::-webkit-details-marker]:hidden">
                      <span className="text-lg font-semibold">{f.q}</span>
                      <span className="relative grid size-9 shrink-0 place-items-center rounded-full border border-white/15 transition-[background-color,border-color,transform] duration-300 group-open:rotate-180 group-open:border-brand-yellow group-open:bg-brand-yellow">
                        <span className="absolute h-0.5 w-3.5 bg-white group-open:bg-brand-black" />
                        <span className="absolute h-3.5 w-0.5 bg-white transition-transform duration-300 group-open:rotate-90 group-open:opacity-0" />
                      </span>
                    </summary>
                    <p className="faq-body pb-6 text-white/70">{f.a}</p>
                  </details>
                ))}
              </div>
            </div>
          </div>
        </section>

        {pkg.slug === "takmicarske-pripreme" ? (
          <ClientResults />
        ) : (
          <Transformations ctaHref={apply} ctaLabel="Prijavi se" />
        )}

        <section id="paket-kraj" className="px-5 py-24 lg:py-32">
          <div className="mx-auto max-w-7xl">
            <div className="relative isolate overflow-hidden rounded-lg bg-brand-yellow px-6 py-14 text-brand-black sm:px-12 lg:px-16 lg:py-20">
              <svg
                aria-hidden="true"
                viewBox="0 0 200 150"
                className="pointer-events-none absolute -right-6 -bottom-10 -z-10 h-64 w-auto select-none lg:h-96"
              >
                <text
                  x="200"
                  y="150"
                  textAnchor="end"
                  fill="#0a0a0a"
                  fillOpacity="0.06"
                  style={{ fontFamily: "var(--font-display)", fontSize: 190 }}
                >
                  GA
                </text>
              </svg>
              <h2 className="max-w-3xl font-display text-6xl leading-[0.88] sm:text-7xl lg:text-8xl">
                Spreman za prvi korak?
              </h2>
              <p className="mt-5 max-w-lg text-lg font-semibold">
                {pkg.name}, {formatPrice(pkg.price)} {pkg.priceUnit}. Popuni upitnik i javljam ti se
                na mail.
              </p>
              <Link
                href={apply}
                className="group mt-9 inline-flex min-h-14 items-center gap-3 rounded-md bg-brand-black px-8 text-lg font-bold text-white transition-colors hover:text-brand-yellow"
              >
                Prijavi se
                <ArrowRightIcon className="size-5 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>

            <h2 className="mt-24 font-display text-5xl leading-none sm:text-6xl">Ostali paketi</h2>
            <ul className="mt-8 grid gap-4 md:grid-cols-3">
              {others.map((o) => (
                <li key={o.slug}>
                  <Link
                    href={`/paketi/${o.slug}`}
                    className="group flex h-full flex-col rounded-lg border border-brand-line bg-brand-surface p-6 transition-[border-color,transform] duration-300 hover:-translate-y-1 hover:border-brand-yellow/60"
                  >
                    <span className="text-xs font-bold tracking-[0.14em] text-white/50 uppercase">
                      {o.checkIn}
                    </span>
                    <span className="mt-3 font-display text-4xl leading-none">{o.name}</span>
                    <span className="mt-3 flex-1 text-white/60">{o.audience}</span>
                    <span className="mt-6 flex items-center justify-between gap-4 border-t border-brand-line pt-4">
                      <span className="font-semibold">
                        {formatPrice(o.price)} <span className="text-white/55">{o.priceUnit}</span>
                      </span>
                      <ArrowRightIcon className="size-5 text-brand-yellow transition-transform group-hover:translate-x-1" />
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </main>
      <SiteFooter />
      <ChatButton link={chat} />
      <StickyCta
        href={apply}
        price={formatPrice(pkg.price)}
        unit={pkg.priceUnit}
        watchId="paket-cta"
      />
    </>
  );
}
