import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageShell } from "@/components/layout/PageShell";
import { termsBlocks } from "@/content/texts";
import { getTexts } from "@/lib/content/texts";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Opći uvjeti poslovanja",
  description: "Uvjeti suradnje, plaćanja i povrata novca za online coaching s Adnanom Gostom.",
  alternates: { canonical: "/opci-uvjeti" },
};

export default async function TermsPage() {
  const { terms } = await getTexts();
  const blocks = termsBlocks(terms.body);
  if (blocks.length === 0) notFound();

  return (
    <PageShell>
      <section className="px-5 pt-32 pb-24 lg:pt-44 lg:pb-32">
        <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[16rem_1fr] lg:gap-16">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <h1 className="font-display text-6xl leading-[0.88] sm:text-7xl">
              Opći uvjeti
              <br />
              poslovanja
            </h1>
          </div>
          <div className="max-w-2xl text-white/75 [&_li]:mt-2 [&_p]:mt-4 [&_p]:leading-relaxed [&_ul]:mt-4 [&_ul]:list-disc [&_ul]:space-y-1 [&_ul]:pl-5">
            {blocks.map((b, i) =>
              b.kind === "h" ? (
                <h2
                  key={i}
                  className="mt-12 border-t border-brand-line pt-8 font-display text-4xl leading-none text-white first:mt-0 first:border-t-0 first:pt-0"
                >
                  {b.text}
                </h2>
              ) : b.kind === "ul" ? (
                <ul key={i}>
                  {b.items.map((item, j) => (
                    <li key={j}>{item}</li>
                  ))}
                </ul>
              ) : (
                <p key={i} className="first:mt-0">
                  {b.text}
                </p>
              ),
            )}
          </div>
        </div>
      </section>
    </PageShell>
  );
}
