export interface Nonprofit {
	icon_url: string
	id: string
	name?: string
	ein: string
	website?: string
	logo_url?: string
	city?: string
	state?: string
}

export interface NonprofitSearchResults {
	nonprofits: Nonprofit[]
	page: number
}
