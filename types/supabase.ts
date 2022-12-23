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
					created_at: string
					user_id: string
					change_id: string
					weight: number
				}
				Insert: {
					id?: number
					created_at?: string
					user_id?: string
					change_id: string
					weight?: number
				}
				Update: {
					id?: number
					created_at?: string
					user_id?: string
					change_id?: string
					weight?: number
				}
			}
			profiles: {
				Row: {
					user_id: string
					first_name: string | null
					last_name: string | null
					percentage: number
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
					percentage: number
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
					percentage?: number
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
					user_id: string | null
					email: unknown | null
				}
				Insert: {
					id?: number
					change_id: string
					user_id?: string | null
					email?: unknown | null
				}
				Update: {
					id?: number
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
						Args: { '': string }
						Returns: unknown
				  }
				| {
						Args: { '': boolean }
						Returns: unknown
				  }
				| {
						Args: { '': unknown }
						Returns: unknown
				  }
			citext_hash: {
				Args: { '': unknown }
				Returns: number
			}
			citextin: {
				Args: { '': unknown }
				Returns: unknown
			}
			citextout: {
				Args: { '': unknown }
				Returns: unknown
			}
			citextrecv: {
				Args: { '': unknown }
				Returns: unknown
			}
			citextsend: {
				Args: { '': unknown }
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
