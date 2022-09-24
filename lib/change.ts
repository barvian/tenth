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
    nonprofits: Nonprofit[],
    page: number
}

const CREDS = Buffer.from(process.env.NEXT_PUBLIC_CHANGE_KEY+':'+process.env.SECRET_CHANGE_KEY).toString('base64')

export const getCharity = (id: string) => fetch(
    `https://api.getchange.io/api/v1/nonprofits/${id}`, {
        headers: { 'Authorization': `Basic ${CREDS}`}
    }
).then(res => res.json())
