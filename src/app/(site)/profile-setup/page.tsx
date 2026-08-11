import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ProfileSetupForm } from "@/components/forms/ProfileSetupForm";
import { getDictionary } from "@/lib/i18n/server";

export default async function ProfileSetupPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next } = await searchParams;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const { t } = await getDictionary();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("name")
    .eq("id", user.id)
    .single();

  if (profile?.name) {
    redirect(next || "/");
  }

  return (
    <div className="mx-auto flex max-w-sm flex-col gap-6 px-4 py-16">
      <div className="flex flex-col gap-6 rounded-2xl border border-white/10 bg-white p-6 shadow-xl sm:p-8">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">{t.profileSetup.title}</h1>
          <p className="mt-1 text-sm text-slate-600">{t.profileSetup.description}</p>
        </div>
        <ProfileSetupForm email={user.email ?? ""} next={next ?? "/"} t={t.profileSetup} />
      </div>
    </div>
  );
}
