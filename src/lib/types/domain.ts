// Shared file — coordinate with Student 2 before editing.
// Mirrors the Postgres enums defined in supabase/migrations/0001_init_schema.sql.

export type ItemType = "lost" | "found";
export type ItemStatus = "open" | "claimed" | "returned" | "closed";
export type ClaimStatus = "pending" | "accepted" | "rejected";

export const CATEGORY_OPTIONS = [
  "Electronics",
  "Wallet / Money",
  "Keys",
  "Bag",
  "Clothing",
  "Books",
  "ID / Cards",
  "Accessories",
  "Other",
] as const;

export type Category = (typeof CATEGORY_OPTIONS)[number];

// Display labels for these enum/category values live in the i18n dictionary
// (src/lib/i18n/dictionary.ts: t.categories / t.itemType / t.itemStatus /
// t.claimStatus) since they need to switch with the TR/EN language toggle.
// The values here stay in English — they're the DB contract shared with
// Student 2 (item_type/item_status/claim_status enums, category check
// constraint).

export interface Profile {
  id: string;
  email: string;
  name: string | null;
  created_at: string;
}

export interface Item {
  id: string;
  owner_id: string;
  type: ItemType;
  title: string;
  description: string;
  category: Category;
  location: string;
  item_date: string;
  image_url: string;
  status: ItemStatus;
  created_at: string;
  updated_at: string;
}

export interface OwnerClaimDetail {
  claim_id: string;
  item_id: string;
  claim_status: ClaimStatus;
  message: string;
  created_at: string;
  claimant_name: string | null;
  claimant_email: string | null;
  owner_id: string;
}
