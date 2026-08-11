"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function submitClaim(
  itemId: string,
  message: string
): Promise<{ error?: string }> {
  const trimmed = message.trim();
  if (!trimmed) {
    return { error: "Please describe your proof of ownership." };
  }

  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You must be logged in to send a claim." };
  }

  const { error } = await supabase.from("claims").insert({
    item_id: itemId,
    claimant_id: user.id,
    message: trimmed,
  });

  if (error) {
    if (error.code === "23505") {
      return { error: "You've already sent a claim for this item." };
    }
    return { error: "This item can't be claimed right now." };
  }

  revalidatePath(`/items/${itemId}`);
  revalidatePath("/sent-claims");
  return {};
}
