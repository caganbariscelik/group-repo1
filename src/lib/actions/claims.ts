"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getDictionary } from "@/lib/i18n/server";

export type SubmitClaimState = { error: string | null; success: boolean };

// Student 2's browse/claim-submission flow. Relies on the DB-level guards
// already in place from 0001/0003: one claim per (item, claimant), only
// found+open items, and never your own item — this just surfaces those as
// friendly messages instead of raw Postgres errors.
export async function submitClaim(
  itemId: string,
  _prevState: SubmitClaimState,
  formData: FormData,
): Promise<SubmitClaimState> {
  const message = String(formData.get("message") ?? "").trim();
  const { t } = await getDictionary();

  if (!message) {
    return { error: t.claimForm.messageRequired, success: false };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { error } = await supabase.from("claims").insert({
    item_id: itemId,
    claimant_id: user.id,
    message,
  });

  if (error) {
    if (error.code === "23505") {
      return { error: t.claimForm.duplicateClaim, success: false };
    }
    return { error: error.message, success: false };
  }

  revalidatePath(`/items/${itemId}`);
  return { error: null, success: true };
}

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
