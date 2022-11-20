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
          change_id: string | null
        }
        Insert: {
          id?: number
          user_id: string
          change_id?: string | null
        }
        Update: {
          id?: number
          user_id?: string
          change_id?: string | null
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
        }
        Insert: {
          user_id: string
          first_name?: string | null
          last_name?: string | null
          percentage?: number | null
          stripe_id: string
          change_id: string
        }
        Update: {
          user_id?: string
          first_name?: string | null
          last_name?: string | null
          percentage?: number | null
          stripe_id?: string
          change_id?: string
        }
      }
      requests: {
        Row: {
          change_id: string
          user_id: string | null
          email: unknown | null
        }
        Insert: {
          change_id: string
          user_id?: string | null
          email?: unknown | null
        }
        Update: {
          change_id?: string
          user_id?: string | null
          email?: unknown | null
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

