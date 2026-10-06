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
import { Testimonials } from "@/components/sections/Testimonials";
import { InstagramFeed } from "@/components/sections/InstagramFeed";

export const metadata: Metadata = {
  title: "O meni",
  description:
    "Adnan Gosto, IFBB Pro i trener takmičara. Četiri puta zaredom apsolutni prvak BiH, pobjednik Fit Parade Budimpešta i osvajač IFBB Pro Card.",
};

export default function AboutPage() {
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
        <Testimonials />
        <FinalCta />
        <InstagramFeed />
      </main>
      <SiteFooter />
      <BackToTop />
    </>
  );
}
