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
			accounts: {
				Row: {
					stripe_pm_id: string | null
					stripe_fca_id: string | null
					last4: string | null
					institution_name: string | null
					id: number
					user_id: string
					created_at: string
					percentage: number
					status: Database['public']['Enums']['account_status']
				}
				Insert: {
					stripe_pm_id?: string | null
					stripe_fca_id?: string | null
					last4?: string | null
					institution_name?: string | null
					id?: number
					user_id?: string
					created_at?: string
					percentage?: number
					status?: Database['public']['Enums']['account_status']
				}
				Update: {
					stripe_pm_id?: string | null
					stripe_fca_id?: string | null
					last4?: string | null
					institution_name?: string | null
					id?: number
					user_id?: string
					created_at?: string
					percentage?: number
					status?: Database['public']['Enums']['account_status']
				}
			}
			designated: {
				Row: {
					account_id: number
					pledge_org_id: string
					user_id: string
					weight: number
					created_at: string
				}
				Insert: {
					account_id: number
					pledge_org_id: string
					user_id?: string
					weight?: number
					created_at?: string
				}
				Update: {
					account_id?: number
					pledge_org_id?: string
					user_id?: string
					weight?: number
					created_at?: string
				}
			}
			requests: {
				Row: {
					ngo_id: string
					email: unknown | null
					id: number
					user_id: string | null
				}
				Insert: {
					ngo_id: string
					email?: unknown | null
					id?: number
					user_id?: string | null
				}
				Update: {
					ngo_id?: string
					email?: unknown | null
					id?: number
					user_id?: string | null
				}
			}
			users: {
				Row: {
					stripe_cus_id: string
					current_account_id: number | null
					last_acceptance: Json | null
					id: string
					first_name: string | null
					last_name: string | null
					email: string
				}
				Insert: {
					stripe_cus_id: string
					current_account_id?: number | null
					last_acceptance?: Json | null
					id?: string
					first_name?: string | null
					last_name?: string | null
				}
				Update: {
					stripe_cus_id?: string
					current_account_id?: number | null
					last_acceptance?: Json | null
					id?: string
					first_name?: string | null
					last_name?: string | null
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
			email: {
				Args: { '': unknown }
				Returns: string
			}
			email_exists: {
				Args: { email: string }
				Returns: boolean
			}
			register: {
				Args: {
					stripe_cus_id: string
					first_name: string
					last_name: string
					percentage: number
					designated: unknown
				}
				Returns: undefined
			}
		}
		Enums: {
			account_status: 'active' | 'inactive' | 'disconnected'
		}
	}
}
