/*
  O MENI, kostur sekcije. Sadrzaj dolazi iz Supabase-a u sedmici 3.
  id="o-meni" sluzi za skok iz menija: <a href="#o-meni">
*/
export function About() {
  return (
    <section id="o-meni" className="border-t border-brand-line px-5 py-20">
      <div className="mx-auto w-full max-w-6xl">
        <h2 className="font-display text-5xl uppercase">O meni</h2>
        <p className="mt-4 text-brand-muted">U izradi.</p>
      </div>
    </section>
  );
}
