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
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
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

