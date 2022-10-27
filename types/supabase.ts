export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          first_name: string | null;
          last_name: string | null;
          user_id: string;
          stripe_id: string | null;
          change_id: string | null;
          percentage: number | null;
        };
        Insert: {
          first_name?: string | null;
          last_name?: string | null;
          user_id: string;
          stripe_id?: string | null;
          change_id?: string | null;
          percentage?: number | null;
        };
        Update: {
          first_name?: string | null;
          last_name?: string | null;
          user_id?: string;
          stripe_id?: string | null;
          change_id?: string | null;
          percentage?: number | null;
        };
      };
      designated: {
        Row: {
          id: number;
          created_at: string | null;
          user_id: string;
          change_id: string | null;
        };
        Insert: {
          id?: number;
          created_at?: string | null;
          user_id: string;
          change_id?: string | null;
        };
        Update: {
          id?: number;
          created_at?: string | null;
          user_id?: string;
          change_id?: string | null;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      email_exists: {
        Args: { email: string };
        Returns: boolean;
      };
    };
    Enums: {
      [_ in never]: never;
    };
  };
}

