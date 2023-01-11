export interface Organization {
	id: string
	name?: string
	alias?: string
	ngo_id: string
	mission?: string
	street1?: string
	street2?: string
	city?: string
	region?: string
	postal_code?: string
	country?: string
	lat?: string
	lon?: string
	causes?: { id: number; name: string; parent_id: number }[]
	website_url?: string
	profile_url?: string
	logo_url?: string
	disbursement_type?: string
	impact_metrics?: { amount: number; currency: string; description: number }[]
	sustainable_development_goals?: { id: number; name: string }[]
}

export interface OrganizationSearchResults {
	results: Organization[]
	page: number
	per: number
	total_count: number
}

export type OrganizationRequestResponse =
	| null
	| undefined
	| {
			message?: string[]
			error_codes?: [
				'ngo_id_invalid' | 'ngo_exists' | 'ngo_in_process' | 'ngo_ineligible'
			]
	  }
