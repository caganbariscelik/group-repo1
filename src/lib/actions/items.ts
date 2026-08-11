"use server";

import { randomUUID } from "crypto";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import {
  getItemFieldsSchema,
  validateImageFile,
  type ItemFields,
} from "@/lib/validation/itemSchema";
import { ITEM_IMAGES_BUCKET } from "@/lib/constants";
import { getDictionary } from "@/lib/i18n/server";
import type { Dictionary } from "@/lib/i18n/dictionary";

export type ItemFormState = {
  error: string | null;
  fieldErrors: Record<string, string>;
};

function parseFields(
  formData: FormData,
  t: Dictionary,
): {
  data: ItemFields | null;
  fieldErrors: Record<string, string>;
} {
  const raw = {
    type: formData.get("type"),
    title: formData.get("title"),
    description: formData.get("description"),
    category: formData.get("category"),
    item_date: formData.get("item_date"),
    location: formData.get("location"),
  };

  const result = getItemFieldsSchema(t).safeParse(raw);
  if (!result.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of result.error.issues) {
      const key = String(issue.path[0]);
      if (!fieldErrors[key]) fieldErrors[key] = issue.message;
    }
    return { data: null, fieldErrors };
  }
  return { data: result.data, fieldErrors: {} };
}

function extensionFor(file: File) {
  const fromName = file.name.split(".").pop();
  if (fromName && fromName.length <= 5) return fromName.toLowerCase();
  return file.type === "image/png" ? "png" : "jpg";
}

export async function createItem(
  _prevState: ItemFormState,
  formData: FormData,
): Promise<ItemFormState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  const { t } = await getDictionary();

  const { data: fields, fieldErrors } = parseFields(formData, t);
  const imageFile = formData.get("image");
  const image = imageFile instanceof File && imageFile.size > 0 ? imageFile : null;
  const imageError = validateImageFile(image, true, t);
  if (imageError) fieldErrors.image = imageError;

  if (!fields || Object.keys(fieldErrors).length > 0) {
    return { error: t.itemActions.fixErrors, fieldErrors };
  }

  const path = `${user.id}/${randomUUID()}.${extensionFor(image!)}`;
  const { error: uploadError } = await supabase.storage
    .from(ITEM_IMAGES_BUCKET)
    .upload(path, image!, { contentType: image!.type });

  if (uploadError) {
    return {
      error: `${t.itemActions.uploadFailedPrefix}${uploadError.message}`,
      fieldErrors: {},
    };
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from(ITEM_IMAGES_BUCKET).getPublicUrl(path);

  const { error: insertError } = await supabase.from("items").insert({
    owner_id: user.id,
    type: fields.type,
    title: fields.title,
    description: fields.description,
    category: fields.category,
    location: fields.location,
    item_date: fields.item_date,
    image_url: publicUrl,
  });

  if (insertError) {
    await supabase.storage.from(ITEM_IMAGES_BUCKET).remove([path]);
    return { error: insertError.message, fieldErrors: {} };
  }

  revalidatePath("/my-listings");
  redirect("/my-listings");
}

export async function updateItem(
  itemId: string,
  _prevState: ItemFormState,
  formData: FormData,
): Promise<ItemFormState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  const { t } = await getDictionary();

  const { data: existing } = await supabase
    .from("items")
    .select("owner_id, image_url")
    .eq("id", itemId)
    .single();

  if (!existing || existing.owner_id !== user.id) {
    return { error: t.itemActions.onlyOwnListings, fieldErrors: {} };
  }

  const { data: fields, fieldErrors } = parseFields(formData, t);
  const imageFile = formData.get("image");
  const image = imageFile instanceof File && imageFile.size > 0 ? imageFile : null;
  const imageError = validateImageFile(image, false, t);
  if (imageError) fieldErrors.image = imageError;

  if (!fields || Object.keys(fieldErrors).length > 0) {
    return { error: t.itemActions.fixErrors, fieldErrors };
  }

  let imageUrl = existing.image_url;
  if (image) {
    const path = `${user.id}/${randomUUID()}.${extensionFor(image)}`;
    const { error: uploadError } = await supabase.storage
      .from(ITEM_IMAGES_BUCKET)
      .upload(path, image, { contentType: image.type });
    if (uploadError) {
      return {
        error: `${t.itemActions.uploadFailedPrefix}${uploadError.message}`,
        fieldErrors: {},
      };
    }
    imageUrl = supabase.storage.from(ITEM_IMAGES_BUCKET).getPublicUrl(path).data.publicUrl;
  }

  const { error: updateError } = await supabase
    .from("items")
    .update({
      type: fields.type,
      title: fields.title,
      description: fields.description,
      category: fields.category,
      location: fields.location,
      item_date: fields.item_date,
      image_url: imageUrl,
    })
    .eq("id", itemId);

  if (updateError) {
    return { error: updateError.message, fieldErrors: {} };
  }

  revalidatePath("/my-listings");
  redirect("/my-listings");
}

export async function deleteItem(formData: FormData) {
  const itemId = String(formData.get("itemId"));
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { error } = await supabase.from("items").delete().eq("id", itemId);

  if (error) {
    const { t } = await getDictionary();
    redirect(`/my-listings?error=${encodeURIComponent(t.itemActions.hasClaimsError)}`);
  }

  revalidatePath("/my-listings");
  redirect("/my-listings");
}

export async function closeItem(formData: FormData) {
  const itemId = String(formData.get("itemId"));
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { error } = await supabase
    .from("items")
    .update({ status: "closed" })
    .eq("id", itemId);

  if (error) {
    redirect(`/my-listings?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/my-listings");
  redirect("/my-listings");
}

export async function markReturned(formData: FormData) {
  const itemId = String(formData.get("itemId"));
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { error } = await supabase
    .from("items")
    .update({ status: "returned" })
    .eq("id", itemId);

  if (error) {
    redirect(`/my-listings?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/my-listings");
  redirect("/my-listings");
}
