import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createItem } from "@/lib/actions/items";
import { ItemForm } from "@/components/forms/ItemForm";
import { getDictionary } from "@/lib/i18n/server";

export default async function ReportPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const { t } = await getDictionary();

  if (!user) {
    redirect("/login?next=/report");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("name")
    .eq("id", user.id)
    .single();

  if (!profile?.name) {
    redirect("/profile-setup?next=/report");
  }

  return (
    <div className="mx-auto max-w-xl px-4 py-12">
      <div className="rounded-2xl border border-white/10 bg-white p-6 shadow-xl sm:p-8">
        <h1 className="text-2xl font-semibold text-slate-900">{t.report.title}</h1>
        <p className="mt-1 text-sm text-slate-600">{t.report.description}</p>
        <div className="mt-6">
          <ItemForm action={createItem} submitLabel={t.report.submitLabel} t={t} />
        </div>
      </div>
    </div>
  );
}
