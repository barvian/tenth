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
			deleted_profiles: {
				Row: {
					email: string
					change_id: string
					deleted_at: string
				}
				Insert: {
					email: string
					change_id: string
					deleted_at?: string
				}
				Update: {
					email?: string
					change_id?: string
					deleted_at?: string
				}
			}
			designated: {
				Row: {
					change_id: string
					user_id: string
					weight: number
					created_at: string
				}
				Insert: {
					change_id: string
					user_id?: string
					weight?: number
					created_at?: string
				}
				Update: {
					change_id?: string
					user_id?: string
					weight?: number
					created_at?: string
				}
			}
			profiles: {
				Row: {
					first_name: string | null
					last_name: string | null
					percentage: number
					stripe_id: string
					change_id: string
					plaid_access_token: string | null
					plaid_institution_id: string | null
					plaid_account_mask: string | null
					plaid_account_type: string | null
					plaid_account_subtype: string | null
					user_id: string
				}
				Insert: {
					first_name?: string | null
					last_name?: string | null
					percentage: number
					stripe_id: string
					change_id: string
					plaid_access_token?: string | null
					plaid_institution_id?: string | null
					plaid_account_mask?: string | null
					plaid_account_type?: string | null
					plaid_account_subtype?: string | null
					user_id?: string
				}
				Update: {
					first_name?: string | null
					last_name?: string | null
					percentage?: number
					stripe_id?: string
					change_id?: string
					plaid_access_token?: string | null
					plaid_institution_id?: string | null
					plaid_account_mask?: string | null
					plaid_account_type?: string | null
					plaid_account_subtype?: string | null
					user_id?: string
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
