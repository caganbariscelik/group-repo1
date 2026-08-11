export type ItemType = "lost" | "found";

export type ItemStatus = "open" | "claimed" | "returned" | "closed";

export type ItemCategory =
  | "Electronics"
  | "Wallet / Money"
  | "Keys"
  | "Bag"
  | "Clothing"
  | "Books"
  | "ID / Cards"
  | "Accessories"
  | "Other";

export const ITEM_CATEGORIES: ItemCategory[] = [
  "Electronics",
  "Wallet / Money",
  "Keys",
  "Bag",
  "Clothing",
  "Books",
  "ID / Cards",
  "Accessories",
  "Other",
];

export type ClaimStatus = "pending" | "accepted" | "rejected";

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
  description: string | null;
  category: ItemCategory;
  location: string | null;
  item_date: string | null;
  image_url: string | null;
  status: ItemStatus;
  created_at: string;
  updated_at: string;
}

export interface Claim {
  id: string;
  item_id: string;
  claimant_id: string;
  message: string;
  status: ClaimStatus;
  created_at: string;
}

export interface ClaimWithItem extends Claim {
  items: Item | null;
}

export interface ClaimWithOwner extends ClaimWithItem {
  items:
    | (Item & {
        profiles: Pick<Profile, "id" | "name" | "email"> | null;
      })
    | null;
}
