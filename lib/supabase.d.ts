export type Json =
	| string
	| number
	| boolean
	| null
	| { [key: string]: Json }
	| Json[]

export interface Database {
	graphql_public: {
		Tables: {
			[_ in never]: never
		}
		Views: {
			[_ in never]: never
		}
		Functions: {
			graphql: {
				Args: {
					operationName?: string
					query?: string
					variables?: Json
					extensions?: Json
				}
				Returns: Json
			}
		}
		Enums: {
			[_ in never]: never
		}
		CompositeTypes: {
			[_ in never]: never
		}
	}
	public: {
		Tables: {
			accounts: {
				Row: {
					created_at: string
					id: number
					institution_name: string | null
					last4: string | null
					percentage: number
					status: Database['public']['Enums']['account_status']
					stripe_fca_id: string | null
					stripe_pm_id: string | null
					user_id: string
				}
				Insert: {
					created_at?: string
					id?: number
					institution_name?: string | null
					last4?: string | null
					percentage?: number
					status?: Database['public']['Enums']['account_status']
					stripe_fca_id?: string | null
					stripe_pm_id?: string | null
					user_id?: string
				}
				Update: {
					created_at?: string
					id?: number
					institution_name?: string | null
					last4?: string | null
					percentage?: number
					status?: Database['public']['Enums']['account_status']
					stripe_fca_id?: string | null
					stripe_pm_id?: string | null
					user_id?: string
				}
			}
			designated: {
				Row: {
					account_id: number
					created_at: string
					pledge_org_id: string
					user_id: string
					weight: number
				}
				Insert: {
					account_id: number
					created_at?: string
					pledge_org_id: string
					user_id?: string
					weight?: number
				}
				Update: {
					account_id?: number
					created_at?: string
					pledge_org_id?: string
					user_id?: string
					weight?: number
				}
			}
			requests: {
				Row: {
					email: string | null
					id: number
					ngo_id: string
					user_id: string | null
				}
				Insert: {
					email?: string | null
					id?: number
					ngo_id: string
					user_id?: string | null
				}
				Update: {
					email?: string | null
					id?: number
					ngo_id?: string
					user_id?: string | null
				}
			}
			users: {
				Row: {
					current_account_id: number | null
					first_name: string | null
					id: string
					last_acceptance: Json | null
					last_name: string | null
					stripe_cus_id: string
					email: string | null
				}
				Insert: {
					current_account_id?: number | null
					first_name?: string | null
					id?: string
					last_acceptance?: Json | null
					last_name?: string | null
					stripe_cus_id: string
				}
				Update: {
					current_account_id?: number | null
					first_name?: string | null
					id?: string
					last_acceptance?: Json | null
					last_name?: string | null
					stripe_cus_id?: string
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
						Returns: string
				  }
				| {
						Args: { '': boolean }
						Returns: string
				  }
				| {
						Args: { '': unknown }
						Returns: string
				  }
			citext_hash: {
				Args: { '': string }
				Returns: number
			}
			citextin: {
				Args: { '': unknown }
				Returns: string
			}
			citextout: {
				Args: { '': string }
				Returns: unknown
			}
			citextrecv: {
				Args: { '': unknown }
				Returns: string
			}
			citextsend: {
				Args: { '': string }
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
					designated: Database['public']['CompositeTypes']['designated_input'][]
				}
				Returns: undefined
			}
		}
		Enums: {
			account_status: 'active' | 'inactive' | 'disconnected'
		}
		CompositeTypes: {
			designated_input: {
				pledge_org_id: string
				weight: number
			}
		}
	}
	storage: {
		Tables: {
			buckets: {
				Row: {
					created_at: string | null
					id: string
					name: string
					owner: string | null
					public: boolean | null
					updated_at: string | null
				}
				Insert: {
					created_at?: string | null
					id: string
					name: string
					owner?: string | null
					public?: boolean | null
					updated_at?: string | null
				}
				Update: {
					created_at?: string | null
					id?: string
					name?: string
					owner?: string | null
					public?: boolean | null
					updated_at?: string | null
				}
			}
			migrations: {
				Row: {
					executed_at: string | null
					hash: string
					id: number
					name: string
				}
				Insert: {
					executed_at?: string | null
					hash: string
					id: number
					name: string
				}
				Update: {
					executed_at?: string | null
					hash?: string
					id?: number
					name?: string
				}
			}
			objects: {
				Row: {
					bucket_id: string | null
					created_at: string | null
					id: string
					last_accessed_at: string | null
					metadata: Json | null
					name: string | null
					owner: string | null
					path_tokens: string[] | null
					updated_at: string | null
				}
				Insert: {
					bucket_id?: string | null
					created_at?: string | null
					id?: string
					last_accessed_at?: string | null
					metadata?: Json | null
					name?: string | null
					owner?: string | null
					path_tokens?: string[] | null
					updated_at?: string | null
				}
				Update: {
					bucket_id?: string | null
					created_at?: string | null
					id?: string
					last_accessed_at?: string | null
					metadata?: Json | null
					name?: string | null
					owner?: string | null
					path_tokens?: string[] | null
					updated_at?: string | null
				}
			}
		}
		Views: {
			[_ in never]: never
		}
		Functions: {
			extension: {
				Args: { name: string }
				Returns: string
			}
			filename: {
				Args: { name: string }
				Returns: string
			}
			foldername: {
				Args: { name: string }
				Returns: string[]
			}
			get_size_by_bucket: {
				Args: Record<PropertyKey, never>
				Returns: { size: number; bucket_id: string }[]
			}
			search: {
				Args: {
					prefix: string
					bucketname: string
					limits?: number
					levels?: number
					offsets?: number
					search?: string
					sortcolumn?: string
					sortorder?: string
				}
				Returns: {
					name: string
					id: string
					updated_at: string
					created_at: string
					last_accessed_at: string
					metadata: Json
				}[]
			}
		}
		Enums: {
			[_ in never]: never
		}
		CompositeTypes: {
			[_ in never]: never
		}
	}
}
