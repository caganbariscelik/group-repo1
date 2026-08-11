"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function acceptClaim(formData: FormData) {
  const claimId = String(formData.get("claimId"));
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { error } = await supabase.rpc("accept_claim", { p_claim_id: claimId });

  if (error) {
    redirect(`/my-listings?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/my-listings");
  redirect("/my-listings");
}

export async function rejectClaim(formData: FormData) {
  const claimId = String(formData.get("claimId"));
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { error } = await supabase.rpc("reject_claim", { p_claim_id: claimId });

  if (error) {
    redirect(`/my-listings?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/my-listings");
  redirect("/my-listings");
}
