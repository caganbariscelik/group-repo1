"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getDictionary } from "@/lib/i18n/server";

export type UpdateProfileNameState = { error: string | null };

export async function updateProfileName(
  _prevState: UpdateProfileNameState,
  formData: FormData,
): Promise<UpdateProfileNameState> {
  const name = String(formData.get("name") ?? "").trim();
  const next = String(formData.get("next") ?? "/");

  if (!name) {
    const { t } = await getDictionary();
    return { error: t.profileSetup.nameRequiredError };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { error } = await supabase
    .from("profiles")
    .update({ name })
    .eq("id", user.id);

  if (error) {
    return { error: error.message };
  }

  redirect(next || "/");
}
