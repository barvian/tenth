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
          user_id: string;
          first_name: string | null;
          last_name: string | null;
          percentage: number | null;
        };
        Insert: {
          user_id: string;
          first_name?: string | null;
          last_name?: string | null;
          percentage?: number | null;
        };
        Update: {
          user_id?: string;
          first_name?: string | null;
          last_name?: string | null;
          percentage?: number | null;
        };
      };
      data: {
        Row: {
          user_id: string;
          stripe_id: string | null;
        };
        Insert: {
          user_id: string;
          stripe_id?: string | null;
        };
        Update: {
          user_id?: string;
          stripe_id?: string | null;
        };
      };
      designated: {
        Row: {
          change_id: string | null;
          id: number;
          created_at: string | null;
          user_id: string | null;
        };
        Insert: {
          change_id?: string | null;
          id?: number;
          created_at?: string | null;
          user_id?: string | null;
        };
        Update: {
          change_id?: string | null;
          id?: number;
          created_at?: string | null;
          user_id?: string | null;
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

