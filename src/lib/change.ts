export interface Nonprofit {
	icon_url?: string
	id: string
	name?: string
	ein?: string
	website?: string
	logo_url?: string
	city?: string
	state?: string
}

export interface NonprofitSearchResults {
	nonprofits: Nonprofit[]
	page: number
}

// use the empty string to identify Tenth
export const SELF_CHANGE_ID = ' '

export const getSelf = (url: URL): Nonprofit => ({
	id: SELF_CHANGE_ID,
	icon_url: '/favicon.svg',
	name: 'Tenth',
	website: url.origin
})
