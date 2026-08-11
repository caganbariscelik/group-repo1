// Shared file — coordinate with Student 2 before editing.

import { z } from "zod";
import { CATEGORY_OPTIONS } from "@/lib/types/domain";
import {
  ACCEPTED_IMAGE_TYPES,
  MAX_IMAGE_BYTES,
  MAX_IMAGE_MB,
} from "@/lib/constants";
import type { Dictionary } from "@/lib/i18n/dictionary";

export function getItemFieldsSchema(t: Dictionary) {
  return z.object({
    type: z.enum(["lost", "found"]),
    title: z.string().trim().min(1, t.validation.titleRequired).max(120),
    description: z.string().trim().min(1, t.validation.descriptionRequired).max(2000),
    category: z.enum(CATEGORY_OPTIONS),
    item_date: z.string().trim().min(1, t.validation.dateRequired),
    location: z.string().trim().min(1, t.validation.locationRequired).max(200),
  });
}

export type ItemFields = z.infer<ReturnType<typeof getItemFieldsSchema>>;

export function validateImageFile(
  file: File | null,
  required: boolean,
  t: Dictionary,
): string | null {
  if (!file || file.size === 0) {
    return required ? t.validation.imageRequired : null;
  }
  if (!ACCEPTED_IMAGE_TYPES.includes(file.type as (typeof ACCEPTED_IMAGE_TYPES)[number])) {
    return t.validation.imageType;
  }
  if (file.size > MAX_IMAGE_BYTES) {
    return `${t.validation.imageSizePrefix}${MAX_IMAGE_MB}${t.validation.imageSizeSuffix}`;
  }
  return null;
}
