-- =====================================================================
-- seed.sql | privremeni ali REALNI podaci za razvoj
-- Pokreni NAKON 0001_init.sql. Kad Adnan posalje prave pakete i pitanja,
-- ovo obrisi i unesi njegove kroz admin panel.
-- =====================================================================

insert into public.packages (slug, name, tagline, audience, duration, price_label, features, position)
values
  ('klasicni-coaching', 'Klasični coaching',
   'Individualni plan treninga i ishrane uz redovne provjere.',
   'Za one koji žele ozbiljan napredak uz stručno vodstvo', 'mjesečno', 'na upit',
   array['Plan treninga po mjeri', 'Plan ishrane', 'Sedmične provjere', 'Podrška kroz poruke'], 1),
  ('paket-12-sedmica', 'Paket 12 sedmica',
   'Tri mjeseca fokusiranog rada s jasnim ciljem.',
   'Za one koji žele vidljivu promjenu u zadanom roku', '12 sedmica', 'na upit',
   array['Početna procjena', 'Plan po fazama', 'Praćenje napretka', 'Završna analiza'], 2),
  ('edukacija-za-trenere', 'Edukacija za trenere',
   'Znanje iz takmičarske prakse za trenere koji rade s klijentima.',
   'Za trenere i one koji to žele postati', 'po dogovoru', 'na upit',
   array['Priprema takmičara', 'Planiranje ishrane', 'Rad s klijentima'], 3);

-- Pitanja za klasicni coaching (korak 1 = osnovno, korak 2 = detalji)
insert into public.package_questions (package_id, label, field_type, options, is_required, step, position)
select id, q.label, q.field_type, q.options::jsonb, q.is_required, q.step, q.position
from public.packages,
  (values
    ('Koji ti je glavni cilj?', 'select', '["Izgradnja mišića", "Gubitak masnoće", "Priprema za takmičenje", "Zdravlje i forma"]', true, 1, 1),
    ('Koliko dugo treniraš?', 'select', '["Početnik", "1 do 3 godine", "Više od 3 godine"]', true, 1, 2),
    ('Koliko puta sedmično možeš trenirati?', 'number', null, true, 2, 1),
    ('Imaš li povreda ili zdravstvenih ograničenja?', 'textarea', null, false, 2, 2),
    ('Šta želiš da postigneš za tri mjeseca?', 'textarea', null, true, 2, 3)
  ) as q(label, field_type, options, is_required, step, position)
where slug = 'klasicni-coaching';

insert into public.site_content (key, value) values
  ('hero_title', 'Kako doći do forme'),
  ('hero_subtitle', 'Coaching, priprema takmičara i edukacija za trenere.'),
  ('about_title', 'O meni');
