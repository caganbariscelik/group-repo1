// Shared file — coordinate with Student 2 before editing.

export { CATEGORY_OPTIONS } from "@/lib/types/domain";

export const MAX_IMAGE_MB = 5;
export const MAX_IMAGE_BYTES = MAX_IMAGE_MB * 1024 * 1024;
export const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png"] as const;
export const ACCEPTED_IMAGE_EXTENSIONS = [".jpg", ".jpeg", ".png"] as const;
export const ITEM_IMAGES_BUCKET = "item-images";
