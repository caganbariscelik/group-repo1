// Shared file — coordinate with Student 2 before editing.
// Hand-written to match supabase/migrations/0001_init_schema.sql /
// 0002_storage.sql. Regenerate with `supabase gen types typescript` instead
// once the Supabase CLI is available, if it ever drifts.

import type { Category, ClaimStatus, ItemStatus, ItemType } from "./domain";

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          name: string | null;
          created_at: string;
        };
        Insert: {
          id: string;
          email: string;
          name?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          name?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      items: {
        Row: {
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
        };
        Insert: {
          id?: string;
          owner_id: string;
          type: ItemType;
          title: string;
          description: string;
          category: Category;
          location: string;
          item_date: string;
          image_url: string;
          status?: ItemStatus;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          owner_id?: string;
          type?: ItemType;
          title?: string;
          description?: string;
          category?: Category;
          location?: string;
          item_date?: string;
          image_url?: string;
          status?: ItemStatus;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      claims: {
        Row: {
          id: string;
          item_id: string;
          claimant_id: string;
          message: string;
          status: ClaimStatus;
          created_at: string;
        };
        Insert: {
          id?: string;
          item_id: string;
          claimant_id: string;
          message: string;
          status?: ClaimStatus;
          created_at?: string;
        };
        Update: {
          id?: string;
          item_id?: string;
          claimant_id?: string;
          message?: string;
          status?: ClaimStatus;
          created_at?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      profiles_public: {
        Row: {
          id: string;
          name: string | null;
        };
        Relationships: [];
      };
      owner_claim_details: {
        Row: {
          claim_id: string;
          item_id: string;
          claim_status: ClaimStatus;
          message: string;
          created_at: string;
          claimant_name: string | null;
          claimant_email: string | null;
          owner_id: string;
        };
        Relationships: [];
      };
    };
    Functions: {
      accept_claim: {
        Args: { p_claim_id: string };
        Returns: void;
      };
      reject_claim: {
        Args: { p_claim_id: string };
        Returns: void;
      };
    };
  };
}
