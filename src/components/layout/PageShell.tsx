import { SiteHeader } from "@/components/sections/SiteHeader";
import { SiteFooter } from "@/components/sections/SiteFooter";
import { BackToTop } from "@/components/sections/BackToTop";
import { ChatButton } from "@/components/sections/ChatButton";
import { contactLink } from "@/lib/contact";

export function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <a
        href="#sadrzaj"
        className="sr-only z-50 rounded bg-brand-yellow px-4 py-2 font-semibold text-brand-black focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
      >
        Preskoči na sadržaj
      </a>
      <SiteHeader />
      <main id="sadrzaj">{children}</main>
      <SiteFooter />
      <BackToTop />
      <ChatButton link={contactLink()} />
    </>
  );
}
