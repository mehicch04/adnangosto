import "server-only";
import type { CoachingPackage } from "@/content/packages";

export type AnswerRow = { section: string; question: string; answer: string };

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

const nl = (s: string) => esc(s).replace(/\n/g, "<br>");

function shell(body: string) {
  return `<!doctype html><html lang="bs"><body style="margin:0;background:#f3f3f1;font-family:Arial,Helvetica,sans-serif;color:#0a0a0a"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f3f3f1;padding:24px 12px"><tr><td align="center"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:640px;background:#ffffff;border-radius:8px;overflow:hidden"><tr><td style="background:#0a0a0a;padding:20px 28px"><span style="font-size:20px;font-weight:bold;letter-spacing:2px;color:#edb12d">GOSTO ADNAN</span></td></tr><tr><td style="padding:28px">${body}</td></tr></table></td></tr></table></body></html>`;
}

export function adminEmail(opts: {
  pkg: CoachingPackage;
  name: string;
  email: string;
  rows: AnswerRow[];
  photoLinks: string[];
  adminUrl: string | null;
}) {
  const sections: string[] = [];
  let current = "";
  for (const r of opts.rows) {
    if (r.section !== current) {
      current = r.section;
      sections.push(
        `<tr><td colspan="2" style="padding:18px 0 6px;font-size:12px;font-weight:bold;letter-spacing:1.5px;text-transform:uppercase;color:#8a6a10">${esc(r.section)}</td></tr>`,
      );
    }
    sections.push(
      `<tr><td style="padding:8px 12px 8px 0;border-top:1px solid #eee;vertical-align:top;width:38%;font-size:13px;color:#555">${esc(r.question)}</td><td style="padding:8px 0;border-top:1px solid #eee;vertical-align:top;font-size:14px">${nl(r.answer)}</td></tr>`,
    );
  }
  const photos = opts.photoLinks.length
    ? `<p style="margin:24px 0 8px;font-size:12px;font-weight:bold;letter-spacing:1.5px;text-transform:uppercase;color:#8a6a10">Slike (${opts.photoLinks.length})</p><p style="margin:0;font-size:14px;line-height:1.8">${opts.photoLinks
        .map((u, i) => `<a href="${esc(u)}" style="color:#0a0a0a">Slika ${i + 1}</a>`)
        .join(
          " &nbsp;·&nbsp; ",
        )}</p><p style="margin:6px 0 0;font-size:12px;color:#777">Linkovi za slike vrijede 7 dana. Slike su uvijek dostupne u panelu.</p>`
    : "";
  const panel = opts.adminUrl
    ? `<p style="margin:28px 0 0"><a href="${esc(opts.adminUrl)}" style="display:inline-block;background:#0a0a0a;color:#ffffff;text-decoration:none;padding:12px 20px;border-radius:4px;font-weight:bold">Otvori prijavu u panelu</a></p>`
    : "";
  const html = shell(
    `<p style="margin:0;font-size:13px;color:#777">Nova prijava</p><h1 style="margin:6px 0 4px;font-size:24px">${esc(opts.pkg.name)}</h1><p style="margin:0 0 8px;font-size:15px">${esc(opts.name)} · <a href="mailto:${esc(opts.email)}" style="color:#0a0a0a">${esc(opts.email)}</a></p><p style="margin:0;font-size:13px;color:#777">Na ovaj mail možeš odgovoriti direktno, odgovor ide podnosiocu.</p><table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:12px;border-collapse:collapse">${sections.join("")}</table>${photos}${panel}`,
  );
  const text = [
    `Nova prijava: ${opts.pkg.name}`,
    `${opts.name} <${opts.email}>`,
    "",
    ...opts.rows.map((r) => `${r.question}: ${r.answer}`),
    "",
    ...opts.photoLinks.map((u, i) => `Slika ${i + 1}: ${u}`),
  ].join("\n");
  return { html, text };
}

export function confirmationEmail(opts: { pkg: CoachingPackage; firstName: string }) {
  const steps = [
    "Pregledam tvoje odgovore i slike.",
    "Javljam ti se na ovaj mail s dogovorom oko početka i uplate.",
    `Nakon toga dobiješ početni plan. ${opts.pkg.checkIn}.`,
  ];
  const html = shell(
    `<h1 style="margin:0 0 12px;font-size:24px">Prijava je stigla, ${esc(opts.firstName)}</h1><p style="margin:0 0 16px;font-size:15px;line-height:1.6">Hvala ti na povjerenju. Tvoja prijava za paket <strong>${esc(opts.pkg.name)}</strong> je zaprimljena.</p><p style="margin:0 0 8px;font-size:12px;font-weight:bold;letter-spacing:1.5px;text-transform:uppercase;color:#8a6a10">Šta slijedi</p><ol style="margin:0 0 20px;padding-left:20px;font-size:15px;line-height:1.7">${steps
      .map((s) => `<li>${esc(s)}</li>`)
      .join(
        "",
      )}</ol><p style="margin:0 0 20px;font-size:14px;line-height:1.6;color:#555">Vikendom ne radim, pa ako si prijavu poslao u petak ili subotu, odgovor stiže od ponedjeljka. Ako želiš nešto dopisati, samo odgovori na ovaj mail.</p><p style="margin:0;font-size:15px">Vidimo se na drugoj strani,<br><strong>Adnan Gosto</strong></p>`,
  );
  const text = [
    `Prijava je stigla, ${opts.firstName}`,
    "",
    `Tvoja prijava za paket ${opts.pkg.name} je zaprimljena.`,
    "",
    "Šta slijedi:",
    ...steps.map((s, i) => `${i + 1}. ${s}`),
    "",
    "Vikendom ne radim, pa odgovor na prijavu poslanu u petak ili subotu stiže od ponedjeljka.",
    "",
    "Adnan Gosto",
  ].join("\n");
  return { html, text };
}
