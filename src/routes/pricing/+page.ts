import type { PageLoad } from "./$types"

export const prerender = true

export const load: PageLoad = () => ({
    meta: {
        title: 'Pricing',
        description: `View Tenth fees and pricing information`
    }
})