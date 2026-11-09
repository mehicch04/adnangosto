import type { Metadata } from "next";
import { requireAdmin } from "@/lib/admin/auth";
import { Card, CardHeader, PageHeader, inputClass } from "@/components/admin/ui";
import { PasswordForm, SessionsCard } from "@/app/admin/(panel)/podesavanja/SettingsForms";

export const metadata: Metadata = { title: "Podešavanja" };

export default async function SettingsPage() {
  const { email } = await requireAdmin();
  return (
    <>
      <PageHeader title="Podešavanja" description="Tvoj nalog i sigurnost panela." />
      <div className="mt-8 grid max-w-3xl gap-5">
        <Card>
          <CardHeader title="Nalog" description="Mail kojim se prijavljuješ u panel." />
          <div className="px-5 py-5 sm:px-6">
            <label htmlFor="email" className="mb-1.5 block text-[13px] font-semibold text-white/80">
              E-mail
            </label>
            <input id="email" value={email} readOnly className={`${inputClass} text-white/60`} />
          </div>
        </Card>
        <PasswordForm />
        <SessionsCard />
      </div>
    </>
  );
}
