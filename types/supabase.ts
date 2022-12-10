export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[]

export interface Database {
  public: {
    Tables: {
      designated: {
        Row: {
          id: number
          user_id: string
          change_id: string
        }
        Insert: {
          id?: number
          user_id: string
          change_id: string
        }
        Update: {
          id?: number
          user_id?: string
          change_id?: string
        }
      }
      profiles: {
        Row: {
          user_id: string
          first_name: string | null
          last_name: string | null
          percentage: number | null
          stripe_id: string
          change_id: string
          plaid_institution_id: string | null
          plaid_account_mask: string | null
          plaid_account_type: string | null
          plaid_account_subtype: string | null
        }
        Insert: {
          user_id: string
          first_name?: string | null
          last_name?: string | null
          percentage?: number | null
          stripe_id: string
          change_id: string
          plaid_institution_id?: string | null
          plaid_account_mask?: string | null
          plaid_account_type?: string | null
          plaid_account_subtype?: string | null
        }
        Update: {
          user_id?: string
          first_name?: string | null
          last_name?: string | null
          percentage?: number | null
          stripe_id?: string
          change_id?: string
          plaid_institution_id?: string | null
          plaid_account_mask?: string | null
          plaid_account_type?: string | null
          plaid_account_subtype?: string | null
        }
      }
      requests: {
        Row: {
          id: number
          change_id: string
          email: unknown | null
          user_id: string | null
        }
        Insert: {
          id?: number
          change_id: string
          email?: unknown | null
          user_id?: string | null
        }
        Update: {
          id?: number
          change_id?: string
          email?: unknown | null
          user_id?: string | null
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      citext:
        | {
            Args: { "": string }
            Returns: unknown
          }
        | {
            Args: { "": boolean }
            Returns: unknown
          }
        | {
            Args: { "": unknown }
            Returns: unknown
          }
      citext_hash: {
        Args: { "": unknown }
        Returns: number
      }
      citextin: {
        Args: { "": unknown }
        Returns: unknown
      }
      citextout: {
        Args: { "": unknown }
        Returns: unknown
      }
      citextrecv: {
        Args: { "": unknown }
        Returns: unknown
      }
      citextsend: {
        Args: { "": unknown }
        Returns: string
      }
      email_exists: {
        Args: { email: string }
        Returns: boolean
      }
      register: {
        Args: {
          stripe_id: string
          change_id: string
          first_name: string
          last_name: string
          percentage: number
          designated: unknown
        }
        Returns: undefined
      }
    }
    Enums: {
      [_ in never]: never
    }
  }
}

