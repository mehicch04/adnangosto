import type { Metadata } from "next";
import { SiteHeader } from "@/components/sections/SiteHeader";
import { SiteFooter } from "@/components/sections/SiteFooter";
import { FinalCta } from "@/components/sections/FinalCta";
import { Marquee } from "@/components/sections/Marquee";
import { AboutHero } from "@/components/about/AboutHero";
import { Story } from "@/components/about/Story";
import { StageBand } from "@/components/about/StageBand";
import { CareerResults } from "@/components/about/CareerResults";
import { CoachLegacy } from "@/components/about/CoachLegacy";
import { Gallery } from "@/components/about/Gallery";
import { BackToTop } from "@/components/sections/BackToTop";
import { ChatButton } from "@/components/sections/ChatButton";
import { contactLink } from "@/lib/contact";
import { Testimonials } from "@/components/sections/Testimonials";
import { getTestimonials } from "@/lib/content/transformations";
import { InstagramFeed } from "@/components/sections/InstagramFeed";

export const metadata: Metadata = {
  title: "O meni",
  description:
    "Adnan Gosto, IFBB Pro i trener natjecatelja. Četiri puta zaredom apsolutni prvak BiH, pobjednik Fit Parade Budimpešta i osvajač IFBB Pro Card.",
  alternates: { canonical: "/o-meni" },
};

export default async function AboutPage() {
  const testimonials = await getTestimonials();
  return (
    <>
      <SiteHeader />
      <main>
        <AboutHero />
        <Marquee />
        <Story />
        <StageBand />
        <CareerResults />
        <CoachLegacy />
        <Gallery />
        <Testimonials items={testimonials} />
        <FinalCta />
        <InstagramFeed />
      </main>
      <SiteFooter />
      <BackToTop />
      <ChatButton link={await contactLink()} />
    </>
  );
}
